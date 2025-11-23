import UrlShortenerContainer from "@/components/url-shortener-container";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const urls = await prisma.url.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const initialUrls = urls.map((u) => ({
    originalUrl: u.orginalUrl,
    shortUrl: `${base}/${u.shortCode}`,
    code: u.shortCode,
    visits: u.visits,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center space-y-3">
          <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 shadow-sm">
            ⚡ Your own URL shortener
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            URL Shortener
          </h1>
          <p className="text-sm md:text-base text-slate-300/80 max-w-xl mx-auto">
            Paste a long URL, get a clean short link, and track visits — all
            from your own custom domain.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 shadow-2xl shadow-slate-950/60 backdrop-blur-md px-4 py-5 md:px-6 md:py-6 space-y-6">
          <UrlShortenerContainer initialUrls={initialUrls} />
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Built with Next.js, Prisma & Postgres (Neon)
        </p>
      </div>
    </main>
  );
}
