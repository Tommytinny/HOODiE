"use client";
import React from "react";

export default function ActivityFeed({ items }: { items: any[] }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <h3 className="font-display text-sm">Activity</h3>
      <div className="mt-3 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-800"><img src="/assets/mock-nft.jpg" className="h-full w-full object-cover"/></div>
              <div>
                <div className="text-sm">{it.type} <span className="text-xs text-muted-foreground">#{it.tokenId}</span></div>
                <div className="text-xs text-muted-foreground">{it.wallet} • {it.timeAgo}</div>
              </div>
            </div>
            <div className="text-sm">{it.price} ETH</div>
          </div>
        ))}
      </div>
    </div>
  );
}
