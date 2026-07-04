"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import ActivityFeed from "@/components/marketplace/ActivityFeed";
import { MOCK_LISTINGS, MOCK_ACTIVITY } from "@/lib/mock/marketplace";
import PurchaseModal from "@/components/marketplace/PurchaseModal";

export default function TokenPage({ params }: { params: { tokenId: string } }) {
  const tokenId = Number(params.tokenId);
  const item = useMemo(() => MOCK_LISTINGS.find((m) => m.tokenId === tokenId) || MOCK_LISTINGS[0], [tokenId]);
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <MarketplaceHeader />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg border overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full object-cover" />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-2xl">{item.name} <span className="text-xs text-muted-foreground">#{item.tokenId}</span></h3>
              <p className="mt-2 text-sm text-foreground/80">{item.description}</p>
            </div>
            <div className="mt-6">
              <h4 className="font-display text-sm">Traits</h4>
              <div className="mt-2 flex gap-2">
                <div className="rounded-md border px-3 py-1">Rarity: {item.rarity}</div>
              </div>
            </div>
          </div>
          <aside className="md:col-span-1">
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="mt-1 font-display text-lg">{item.priceEth} ETH</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setBuyOpen(true)} className="rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5">Buy Now</button>
                <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Favorite</button>
              </div>
            </div>
            <div className="mt-4">
              <ActivityFeed items={MOCK_ACTIVITY.filter(a => a.tokenId === tokenId)} />
            </div>
          </aside>
        </div>
      </main>
      <PurchaseModal open={buyOpen} onClose={() => setBuyOpen(false)} item={item} />
    </div>
  );
}
