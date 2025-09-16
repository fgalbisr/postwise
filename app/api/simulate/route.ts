import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { actionId } = body;

    if (!actionId) {
      return NextResponse.json(
        { error: "Missing actionId" },
        { status: 400 }
      );
    }

    const action = await prisma.action.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      return NextResponse.json(
        { error: "Action not found" },
        { status: 404 }
      );
    }

    // Simulate the action execution
    const simulationResult = {
      success: true,
      message: "Simulation completed successfully",
      platform: action.platform,
      entityType: action.entityType,
      entityId: action.entityId,
      actionType: action.actionType,
      params: JSON.parse(action.params),
      expectedImpact: JSON.parse(action.expectedImpact),
      simulation: {
        currentState: {
          spend: JSON.parse(action.params).currentSpend,
          status: "active",
        },
        proposedState: {
          spend: JSON.parse(action.params).suggestedSpend,
          status: action.actionType === "pause" ? "paused" : "active",
        },
        impact: {
          spendChange: JSON.parse(action.params).suggestedSpend - JSON.parse(action.params).currentSpend,
          spendChangePercentage: ((JSON.parse(action.params).suggestedSpend - JSON.parse(action.params).currentSpend) / JSON.parse(action.params).currentSpend) * 100,
          expectedConversions: JSON.parse(action.expectedImpact).expectedConversions,
          expectedRoas: JSON.parse(action.expectedImpact).expectedRoas,
        },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(simulationResult);
  } catch (error) {
    console.error("Error simulating action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
