import { NextResponse } from "next/server";
import { evaluateRow } from "@/lib/gameEngine";
import { Grid } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { grid, rowIndex, combo } = body as {
      grid: Grid;
      rowIndex: number;
      combo: number;
    };

    if (!grid || rowIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = evaluateRow(grid, rowIndex, combo ?? 0);

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ error: "Failed to evaluate move" }, { status: 500 });
  }
}
