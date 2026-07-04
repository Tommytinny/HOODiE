"use client";
import React from "react";

type Stat = { label: string; value: React.ReactNode };

export default function MarketplaceStats({ stats }: { stats: Record<string, any> }) {
  const items: Stat[] = [
    { label: "Floor Price", value: `${stats.floorPrice} ETH` },
    { label: "Total Volume", value: `${stats.totalVolume} ETH` },
    { label: "Owners", value: stats.owners },
    { label: "Items Listed", value: stats.itemsListed },
    { label: "Total Sales", value: stats.totalSales },
    { label: "Average Price", value: `${stats.averagePrice} ETH` },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-6 mb-6">
      {items.map((s) => (
        <div key={s.label} className="rounded-lg border bg-background/60 p-3 text-center">
          <div className="text-xs text-muted-foreground">{s.label}</div>
          <div className="mt-1 font-display text-sm">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
