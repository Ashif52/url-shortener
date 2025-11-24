import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const record = await prisma.url.findUnique({
      where: { shortCode: code },
    });

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.url.update({
      where: { id: record.id },
      data: { visits: record.visits + 1 },
    });

    return NextResponse.redirect(record.target);
  } catch (err) {
    console.error("Redirect error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
