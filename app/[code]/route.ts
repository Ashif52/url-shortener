// app/[code]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// Note: In Next.js 16, the router types expect `params` to be a Promise
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

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
