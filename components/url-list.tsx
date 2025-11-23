"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { CopyIcon, EyeIcon, ExternalLinkIcon } from "lucide-react";
import type { ShortUrlItem } from "./Shorten-form";

type Props = {
  items: ShortUrlItem[];
};

export default function UrlList({ items }: Props) {
  const handleCopy = async (shortUrl: string) => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shortUrl;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-4 text-sm text-slate-300">
        No URLs yet. Paste a link above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-50">Recent URLs</h2>
        <span className="text-xs text-slate-400">
          {items.length} {items.length === 1 ? "link" : "links"}
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.code}
            className="flex flex-col gap-2 rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <Link
                href={item.originalUrl}
                target="_blank"
                className="text-sm text-sky-300 hover:text-sky-200 break-all"
              >
                {item.originalUrl}
              </Link>
              <div className="text-xs text-slate-400 break-all">
                Short:{" "}
                <Link
                  href={item.shortUrl}
                  target="_blank"
                  className="text-sky-400 hover:text-sky-300"
                >
                  {item.shortUrl}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800/80"
                onClick={() => handleCopy(item.shortUrl)}
              >
                <CopyIcon className="w-4 h-4" />
                <span className="sr-only">Copy short URL</span>
              </Button>

              <Button
                asChild
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800/80"
              >
                <Link href={item.shortUrl} target="_blank">
                  <ExternalLinkIcon className="w-4 h-4" />
                  <span className="sr-only">Open short URL</span>
                </Link>
              </Button>

              <span className="flex items-center text-xs text-slate-400">
                <EyeIcon className="h-4 w-4 mr-1" />
                {item.visits} views
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
