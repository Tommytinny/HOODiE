"use client";
import React from "react";
import MarketplaceCard from "./MarketplaceCard";

export default function MarketplaceGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((it) => (
        <MarketplaceCard key={it.tokenId} item={it} />
      ))}
    </div>
  );
}
