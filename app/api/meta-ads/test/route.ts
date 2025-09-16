import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simular datos de Meta Ads para el modo demo
    const mockData = {
      campaigns: [
        {
          id: "120330000000000000",
          name: "Campaña Demo - Facebook Feed",
          status: "ACTIVE",
          budget: 800,
          spend: 600,
          impressions: 45000,
          clicks: 1800,
          conversions: 90,
          roas: 2.5
        },
        {
          id: "120330000000000001",
          name: "Campaña Demo - Instagram Stories",
          status: "ACTIVE",
          budget: 600,
          spend: 450,
          impressions: 35000,
          clicks: 1400,
          conversions: 70,
          roas: 3.1
        },
        {
          id: "120330000000000002",
          name: "Campaña Demo - Messenger",
          status: "ACTIVE",
          budget: 400,
          spend: 300,
          impressions: 20000,
          clicks: 800,
          conversions: 40,
          roas: 2.8
        },
        {
          id: "120330000000000003",
          name: "Campaña Demo - Audience Network",
          status: "ACTIVE",
          budget: 700,
          spend: 525,
          impressions: 60000,
          clicks: 2400,
          conversions: 120,
          roas: 2.9
        }
      ],
      totalBudget: 2500,
      totalSpend: 1875,
      totalImpressions: 160000,
      totalClicks: 6400,
      totalConversions: 320,
      averageRoas: 2.8
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error in Meta Ads test:", error);
    return NextResponse.json(
      { error: "Error testing Meta Ads connection" },
      { status: 500 }
    );
  }
}
