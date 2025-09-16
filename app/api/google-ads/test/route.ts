import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simular datos de Google Ads para el modo demo
    const mockData = {
      campaigns: [
        {
          id: "123456789",
          name: "Campaña Demo - Búsqueda",
          status: "ACTIVE",
          budget: 1000,
          spend: 750,
          impressions: 50000,
          clicks: 2500,
          conversions: 125,
          roas: 3.2
        },
        {
          id: "987654321",
          name: "Campaña Demo - Display",
          status: "ACTIVE",
          budget: 800,
          spend: 600,
          impressions: 75000,
          clicks: 1800,
          conversions: 90,
          roas: 2.8
        },
        {
          id: "456789123",
          name: "Campaña Demo - Shopping",
          status: "ACTIVE",
          budget: 1200,
          spend: 900,
          impressions: 30000,
          clicks: 3200,
          conversions: 160,
          roas: 4.1
        }
      ],
      totalBudget: 3000,
      totalSpend: 2250,
      totalImpressions: 155000,
      totalClicks: 7500,
      totalConversions: 375,
      averageRoas: 3.4
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error in Google Ads test:", error);
    return NextResponse.json(
      { error: "Error testing Google Ads connection" },
      { status: 500 }
    );
  }
}