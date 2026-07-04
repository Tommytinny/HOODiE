"use client";
import React, { useMemo, useState } from "react";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";
import MarketplaceToolbar from "@/components/marketplace/MarketplaceToolbar";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import ListingModal from "@/components/marketplace/ListingModal";
import PurchaseModal from "@/components/marketplace/PurchaseModal";
import ActivityFeed from "@/components/marketplace/ActivityFeed";
import { MOCK_LISTINGS, MOCK_STATS, MOCK_ACTIVITY } from "@/lib/mock/marketplace";
import Particles from "@/components/particles";

export default function MarketplacePage() {
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState<any | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  const items = useMemo(() => MOCK_LISTINGS, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Particles />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <MarketplaceHeader name="HOODIE" />
        <MarketplaceStats stats={MOCK_STATS} />
        <MarketplaceToolbar onToggleView={() => setView(view === "grid" ? "list" : "grid")} />

        <div className="mt-6 grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <FilterSidebar />
          </div>
          <div className="md:col-span-3">
            <MarketplaceGrid items={items} />
            <div className="mt-6 flex justify-center">
              <button className="rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5">Load more</button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ActivityFeed items={MOCK_ACTIVITY} />
        </div>
      </main>

      <ListingModal open={listOpen} onClose={() => setListOpen(false)} item={selected} />
      <PurchaseModal open={buyOpen} onClose={() => setBuyOpen(false)} item={selected} />
    </div>
  );
}
