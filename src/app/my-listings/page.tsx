"use client";
import React from "react";
import { MOCK_LISTINGS } from "@/lib/mock/marketplace";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";

export default function MyListingsPage() {
  const my = MOCK_LISTINGS.slice(0, 6);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-brush text-3xl">My Listings</h2>
        <p className="mt-2 text-sm text-muted-foreground">Manage your active, sold and draft listings.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {my.map((m) => (
            <div key={m.tokenId} className="relative">
              <MarketplaceCard item={m} />
              <div className="mt-2 flex gap-2">
                <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Edit Price</button>
                <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
