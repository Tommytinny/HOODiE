"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MarketplaceCard({ item }: { item: any }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-lg border bg-background/60 overflow-hidden">
      <Link href={`/marketplace/${item.tokenId}`}>
        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-sm">{item.name}</div>
            <div className="text-xs text-muted-foreground">#{item.tokenId}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-sm">{item.priceEth} ETH</div>
            <div className="text-xs text-muted-foreground">{item.seller}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs text-white">{item.rarity}</span>
          <div className="flex gap-2">
            <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">❤</button>
            <button className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Quick View</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
