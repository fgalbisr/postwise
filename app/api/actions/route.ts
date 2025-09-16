import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const actions = await prisma.action.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        recommendation: true,
      },
    });

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error fetching actions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
