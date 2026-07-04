"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ListingModal({ open, onClose, item }: { open: boolean; onClose: () => void; item?: any }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl rounded-lg bg-background p-6">
        <h3 className="font-display text-lg">List NFT</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <img src={item?.image} alt={item?.name} className="h-48 w-full object-cover" />
          <div>
            <div className="text-sm">{item?.name}</div>
            <div className="mt-2 text-xs text-muted-foreground">Current Price: {item?.priceEth} ETH</div>
            <div className="mt-4">Marketplace Fee: 2.5%</div>
            <div className="mt-2">Estimated Earnings: {item ? (item.priceEth * 0.975).toFixed(3) : "-"} ETH</div>
            <input className="mt-3 w-full rounded-md border px-3 py-2" placeholder="Price (ETH)" />
            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Cancel</button>
              <button className="rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5">List</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
