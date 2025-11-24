import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

function generateCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 🔹 read or create ownerId from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    let ownerId =
      cookieHeader
        .split(";")
        .find((c) => c.trim().startsWith("ownerId="))
        ?.split("=")[1] || randomUUID();

    const shortCode = generateCode();

    // 🔹 store the LONG URL in DB (target/original)
    const record = await prisma.url.create({
      data: {
        orginalUrl: url,
        shortCode,
        target: url,   // long URL we will redirect to
        ownerId,
      },
    });

    // 🔹 build the REAL short URL on our domain
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
    const shortUrl = `${base}/${record.shortCode}`;

    // 🔹 send response + set cookie
    const res = NextResponse.json(
      {
        shortUrl,           // ✅ now really short
        code: record.shortCode,
      },
      { status: 200 }
    );

    res.cookies.set("ownerId", ownerId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("POST /api/shorten error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
