"use client";

import { useState } from "react";
import ShortenForm, { ShortUrlItem } from "./Shorten-form";
import UrlList from "./url-list";

type Props = {
  initialUrls: ShortUrlItem[];
};

export default function UrlShortenerContainer({ initialUrls }: Props) {
  const [items, setItems] = useState<ShortUrlItem[]>(initialUrls);

  const handleShortened = (item: ShortUrlItem) => {
    setItems((prev) => [item, ...prev]);
  };

  return (
    <div className="space-y-6">
      <ShortenForm onShortened={handleShortened} />
      <UrlList items={items} />
    </div>
  );
}
