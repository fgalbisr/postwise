import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const aggressiveness = parseInt(searchParams.get("aggressiveness") || "50");

    // Get the most recent dataset and goals
    const latestDataset = await prisma.dataset.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        metricRows: true,
        recommendations: {
          where: { status: "pending" },
        },
      },
    });

    if (!latestDataset || latestDataset.metricRows.length === 0) {
      return NextResponse.json({ error: "No data available" }, { status: 404 });
    }

    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    const currentGoal = goals[0];

    // Analyze campaign performance
    const campaignPerformance = latestDataset.metricRows.reduce((acc, row) => {
      if (!acc[row.campaign]) {
        acc[row.campaign] = {
          spend: 0,
          clicks: 0,
          conversions: 0,
          convValue: 0,
          platform: row.platform,
        };
      }
      acc[row.campaign].spend += row.spend;
      acc[row.campaign].clicks += row.clicks;
      acc[row.campaign].conversions += row.conversions;
      acc[row.campaign].convValue += row.convValue;
      return acc;
    }, {} as Record<string, any>);

    // Calculate ROAS for each campaign
    const campaignsWithRoas = Object.entries(campaignPerformance).map(([campaign, data]) => ({
      campaign,
      platform: data.platform,
      spend: data.spend,
      conversions: data.conversions,
      convValue: data.convValue,
      roas: data.spend > 0 ? data.convValue / data.spend : 0,
    }));

    // Sort campaigns by ROAS
    const sortedCampaigns = campaignsWithRoas.sort((a, b) => b.roas - a.roas);

    // Generate recommendations based on aggressiveness
    const recommendations = [];
    const totalCampaigns = sortedCampaigns.length;
    const topPerformers = Math.ceil(totalCampaigns * (aggressiveness / 100));
    const bottomPerformers = Math.ceil(totalCampaigns * (100 - aggressiveness) / 100);

    // Recommend increasing budget for top performers
    for (let i = 0; i < Math.min(topPerformers, 3); i++) {
      const campaign = sortedCampaigns[i];
      if (campaign.roas > 2.0) { // Only recommend if ROAS > 2x
        const increasePercentage = Math.min(aggressiveness / 10, 50); // Max 50% increase
        const suggestedSpend = campaign.spend * (1 + increasePercentage / 100);
        const expectedConversions = campaign.conversions * (1 + increasePercentage / 100);
        const expectedRoas = campaign.roas;

        recommendations.push({
          level: "increase",
          entity: campaign.campaign,
          platform: campaign.platform,
          currentSpend: campaign.spend,
          suggestedSpend,
          expectedConversions,
          expectedRoas,
          rationale: `High-performing campaign with ${campaign.roas.toFixed(2)}x ROAS. Increasing budget by ${increasePercentage.toFixed(1)}% to scale successful performance.`,
        });
      }
    }

    // Recommend decreasing budget for bottom performers
    for (let i = sortedCampaigns.length - bottomPerformers; i < sortedCampaigns.length; i++) {
      const campaign = sortedCampaigns[i];
      if (campaign.roas < 1.5) { // Only recommend if ROAS < 1.5x
        const decreasePercentage = Math.min((100 - aggressiveness) / 10, 50); // Max 50% decrease
        const suggestedSpend = campaign.spend * (1 - decreasePercentage / 100);
        const expectedConversions = campaign.conversions * (1 - decreasePercentage / 100);
        const expectedRoas = campaign.roas;

        recommendations.push({
          level: "decrease",
          entity: campaign.campaign,
          platform: campaign.platform,
          currentSpend: campaign.spend,
          suggestedSpend,
          expectedConversions,
          expectedRoas,
          rationale: `Underperforming campaign with ${campaign.roas.toFixed(2)}x ROAS. Reducing budget by ${decreasePercentage.toFixed(1)}% to minimize waste.`,
        });
      }
    }

    // Generate AI-powered rationale using OpenAI
    for (const rec of recommendations) {
      try {
        const prompt = `Analyze this ad campaign recommendation and provide a brief, actionable rationale:

Campaign: ${rec.entity}
Platform: ${rec.platform}
Current Spend: $${rec.currentSpend.toLocaleString()}
Suggested Spend: $${rec.suggestedSpend.toLocaleString()}
Current ROAS: ${rec.expectedRoas.toFixed(2)}x
Action: ${rec.level} budget

Provide a 1-2 sentence rationale that explains why this recommendation makes sense. Focus on performance metrics and business impact.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        });

        rec.rationale = completion.choices[0]?.message?.content || rec.rationale;
      } catch (error) {
        console.error("Error generating AI rationale:", error);
        // Keep the original rationale if AI fails
      }
    }

    // Save recommendations to database
    const savedRecommendations = [];
    for (const rec of recommendations) {
      const savedRec = await prisma.recommendation.create({
        data: {
          datasetId: latestDataset.id,
          goalId: currentGoal?.id || "",
          level: rec.level,
          entity: rec.entity,
          currentSpend: rec.currentSpend,
          suggestedSpend: rec.suggestedSpend,
          expectedConversions: rec.expectedConversions,
          expectedRoas: rec.expectedRoas,
          rationale: rec.rationale,
          status: "pending",
        },
      });
      savedRecommendations.push(savedRec);
    }

    return NextResponse.json(savedRecommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
