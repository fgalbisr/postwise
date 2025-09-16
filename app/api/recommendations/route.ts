import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        actions: true,
      },
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recommendationId, action } = body;

    if (!recommendationId || !action) {
      return NextResponse.json(
        { error: "Missing recommendationId or action" },
        { status: 400 }
      );
    }

    const recommendation = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { status: action },
    });

    // If accepting, create actions
    if (action === "accept") {
      const actionType = recommendation.level === "increase" ? "increase_budget" : 
                        recommendation.level === "decrease" ? "decrease_budget" : 
                        "pause";

      await prisma.action.create({
        data: {
          recommendationId: recommendation.id,
          platform: "google", // This should be determined from the recommendation
          entityType: "campaign",
          entityId: recommendation.entity, // This should be the actual platform ID
          actionType,
          params: JSON.stringify({
            currentSpend: recommendation.currentSpend,
            suggestedSpend: recommendation.suggestedSpend,
          }),
          dryRun: true,
          expectedImpact: JSON.stringify({
            expectedConversions: recommendation.expectedConversions,
            expectedRoas: recommendation.expectedRoas,
          }),
        },
      });
    }

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("Error updating recommendation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
