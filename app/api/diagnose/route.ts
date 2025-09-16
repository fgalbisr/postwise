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

    const metricRows = latestDataset.metricRows;

    // Calculate KPIs
    const totalSpend = metricRows.reduce((sum, row) => sum + row.spend, 0);
    const totalClicks = metricRows.reduce((sum, row) => sum + row.clicks, 0);
    const totalConversions = metricRows.reduce((sum, row) => sum + row.conversions, 0);
    const totalImpressions = metricRows.reduce((sum, row) => sum + row.impressions, 0);
    const totalConvValue = metricRows.reduce((sum, row) => sum + row.convValue, 0);

    const averageCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const averageCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const averageCvr = totalClicks > 0 ? totalConversions / totalClicks : 0;
    const averageRoas = totalSpend > 0 ? totalConvValue / totalSpend : 0;
    const averageCpl = totalConversions > 0 ? totalSpend / totalConversions : 0;

    // Calculate platform breakdown
    const platformBreakdown = metricRows.reduce((acc, row) => {
      if (!acc[row.platform]) {
        acc[row.platform] = {
          spend: 0,
          clicks: 0,
          conversions: 0,
          roas: 0,
        };
      }
      acc[row.platform].spend += row.spend;
      acc[row.platform].clicks += row.clicks;
      acc[row.platform].conversions += row.conversions;
      acc[row.platform].roas += row.roas;
      return acc;
    }, {} as Record<string, any>);

    // Calculate campaign performance
    const campaignPerformance = metricRows.reduce((acc, row) => {
      if (!acc[row.campaign]) {
        acc[row.campaign] = {
          spend: 0,
          clicks: 0,
          conversions: 0,
          roas: 0,
          platform: row.platform,
        };
      }
      acc[row.campaign].spend += row.spend;
      acc[row.campaign].clicks += row.clicks;
      acc[row.campaign].conversions += row.conversions;
      acc[row.campaign].roas += row.roas;
      return acc;
    }, {} as Record<string, any>);

    // Identify waste (campaigns with low ROAS or high CPL)
    const wasteThreshold = 2.0; // ROAS threshold
    const wasteCampaigns = Object.entries(campaignPerformance)
      .filter(([_, data]) => data.roas < wasteThreshold)
      .map(([campaign, data]) => ({
        campaign,
        platform: data.platform,
        spend: data.spend,
        conversions: data.conversions,
        roas: data.roas,
        wastePercentage: Math.max(0, (wasteThreshold - data.roas) / wasteThreshold * 100),
      }));

    return NextResponse.json({
      totalSpend,
      totalClicks,
      totalConversions,
      totalImpressions,
      totalConvValue,
      averageCpc,
      averageCtr,
      averageCvr,
      averageRoas,
      averageCpl,
      platformBreakdown,
      campaignPerformance: Object.entries(campaignPerformance).map(([campaign, data]) => ({
        campaign,
        ...data,
      })),
      wasteCampaigns,
      datasetId: latestDataset.id,
    });
  } catch (error) {
    console.error("Error diagnosing data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
