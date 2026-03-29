import { NextResponse } from "next/server";
import { calculateRank } from "@/lib/gameEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { score, insuranceBalance, rowsCleared, reason } = body as {
      score: number;
      insuranceBalance: number;
      rowsCleared: number;
      reason?: string;
    };

    if (score === undefined || insuranceBalance === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rank = calculateRank(score);

    // Future: persist to DB here
    return NextResponse.json({
      success: true,
      finalScore: score,
      insuranceBalance,
      rowsCleared,
      rank,
      reason: reason ?? "Game ended",
      endedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to end game" }, { status: 500 });
  }
}
