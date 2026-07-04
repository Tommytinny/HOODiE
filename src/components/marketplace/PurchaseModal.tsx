"use client";
import React from "react";
import { motion } from "framer-motion";

export default function PurchaseModal({ open, onClose, item }: { open: boolean; onClose: () => void; item?: any }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-md rounded-lg bg-background p-6">
        <h3 className="font-display text-lg">Confirm Purchase</h3>
        <div className="mt-4 flex gap-4">
          <img src={item?.image} alt={item?.name} className="h-24 w-24 object-cover" />
          <div>
            <div className="text-sm">{item?.name}</div>
            <div className="text-xs text-muted-foreground">Price: {item?.priceEth} ETH</div>
            <div className="mt-2">Marketplace Fee: 2.5%</div>
            <div className="mt-1 font-display">Total: {(item?.priceEth || 0) * 1.025} ETH</div>
          </div>
        </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Cancel</button>
            <button className="rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5">Confirm</button>
          </div>
      </motion.div>
    </div>
  );
}
