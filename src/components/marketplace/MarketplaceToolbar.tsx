"use client";
import React from "react";

export default function MarketplaceToolbar({ onToggleView }: { onToggleView?: () => void }) {
  return (
    <div className="sticky top-16 z-20 mb-4 bg-background/80 py-3 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <input placeholder="Search by name, token id, seller..." className="flex-1 rounded-md border px-3 py-2" />
          <select className="rounded-md border px-3 py-2">
            <option>Sort: Recently Listed</option>
            <option>Sort: Price: Low to High</option>
            <option>Sort: Price: High to Low</option>
          </select>
          <div className="hidden sm:block">
            <button onClick={onToggleView} className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Toggle View</button>
          </div>
          <div className="sm:hidden">
            <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
}
