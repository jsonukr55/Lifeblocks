import { NextResponse } from "next/server";
import { generateInitialTray } from "@/lib/blockGenerator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initialInsurance } = body;

    if (!initialInsurance || typeof initialInsurance !== "number" || initialInsurance < 1000) {
      return NextResponse.json(
        { error: "Invalid insurance amount. Minimum is ₹1,000." },
        { status: 400 }
      );
    }

    const tray = generateInitialTray(5);

    return NextResponse.json({
      success: true,
      sessionId: crypto.randomUUID(),
      initialInsurance,
      tray,
      startedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to start game" }, { status: 500 });
  }
}
