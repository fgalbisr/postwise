import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the most recent dataset
    const latestDataset = await prisma.dataset.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        metricRows: true,
      },
    });

    if (!latestDataset || latestDataset.metricRows.length === 0) {
      return NextResponse.json({ error: "No data available" }, { status: 404 });
    }

    // Calculate campaign performance
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

    // Identify waste (campaigns with low ROAS or high CPL)
    const wasteThreshold = 2.0; // ROAS threshold
    const wasteData = Object.entries(campaignPerformance)
      .map(([campaign, data]) => {
        const roas = data.spend > 0 ? data.convValue / data.spend : 0;
        const cpl = data.conversions > 0 ? data.spend / data.conversions : 0;
        const wastePercentage = Math.max(0, (wasteThreshold - roas) / wasteThreshold * 100);
        
        let recommendation = "";
        if (roas < 1.0) {
          recommendation = "Consider pausing this campaign - very low ROAS";
        } else if (roas < 1.5) {
          recommendation = "Reduce budget by 50% - low ROAS";
        } else if (roas < 2.0) {
          recommendation = "Optimize targeting and creative - below target ROAS";
        } else {
          recommendation = "Campaign performing well";
        }

        return {
          id: campaign,
          entity: campaign,
          platform: data.platform,
          spend: data.spend,
          conversions: data.conversions,
          roas,
          cpl,
          wastePercentage,
          recommendation,
        };
      })
      .filter(item => item.wastePercentage > 10) // Only show campaigns with >10% waste
      .sort((a, b) => b.wastePercentage - a.wastePercentage);

    return NextResponse.json(wasteData);
  } catch (error) {
    console.error("Error fetching waste data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
