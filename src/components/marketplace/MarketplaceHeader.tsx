"use client";
import React from "react";

export default function MarketplaceHeader({ name = "HOODIE" }: { name?: string }) {
  return (
    <header className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-brush text-3xl">Marketplace</h2>
          <p className="mt-1 text-sm text-foreground/80">Browse, collect and trade HOODIE NFTs.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-display text-muted-foreground">Collection</div>
          <div className="font-display text-lg">{name} <span className="inline-block ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">Verified</span></div>
        </div>
      </div>
    </header>
  );
}
