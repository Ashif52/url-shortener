"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link2Icon, Loader2Icon, CheckCircle2Icon } from "lucide-react";

export type ShortUrlItem = {
  originalUrl: string;
  shortUrl: string;
  code: string;
  visits: number;
};

type Props = {
  onShortened: (item: ShortUrlItem) => void;
};

export default function ShortenForm({ onShortened }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastShort, setLastShort] = useState<ShortUrlItem | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to shorten URL");
        return;
      }

      const item: ShortUrlItem = {
        originalUrl: data.originalUrl ?? url,
        shortUrl: data.shortUrl,
        code: data.code,
        visits: data.visits ?? 0,
      };

      onShortened(item);
      setLastShort(item);
      setUrl("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3"
      >
        <div className="flex-1">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
              <Link2Icon className="w-4 h-4" />
            </span>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-11 pl-9"
              type="url"
              placeholder="Enter a long URL to shorten"
              required
            />
          </div>
        </div>

        <Button
          className="w-full md:w-auto md:px-6 h-11 font-medium"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Shortening…
            </>
          ) : (
            "Shorten URL"
          )}
        </Button>
      </form>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {lastShort && !error && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
          <CheckCircle2Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">Short link created!</p>
            <p className="break-all">
              <span className="text-slate-300">Short: </span>
              <a
                href={lastShort.shortUrl}
                target="_blank"
                className="underline decoration-dotted underline-offset-2"
              >
                {lastShort.shortUrl}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
