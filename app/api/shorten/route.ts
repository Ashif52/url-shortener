// app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // basic validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const code = Math.random().toString(36).slice(2, 8);

    const record = await prisma.url.create({
      data: {
        orginalUrl: url,
        shortCode: code,
        target: url,
      },
    });

    const base =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    return NextResponse.json(
      {
        shortUrl: `${base}/${record.shortCode}`,
        code: record.shortCode,
        originalUrl: record.orginalUrl,
        visits: record.visits,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("shorten error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
