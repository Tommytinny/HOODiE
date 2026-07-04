"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FilterSidebar({ mobile }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="w-64">
      <div className="hidden md:block">
        <div className="rounded-lg border bg-background/60 p-3">
          <h3 className="font-display text-sm">Filters</h3>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <input className="w-full rounded-md border px-2 py-1" placeholder="0 - 10 ETH" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Rarity</div>
              <select className="w-full rounded-md border px-2 py-1"><option>Any</option><option>Rare</option><option>Epic</option></select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Recently</div>
              <select className="w-full rounded-md border px-2 py-1"><option>Any</option><option>Last 24h</option><option>Last 7d</option></select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden">
        <button onClick={() => setOpen(true)} className="rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] border-primary/40 bg-background/60 text-foreground hover:bg-primary/10">Open Filters</button>
        <motion.div initial={{ x: '100%' }} animate={{ x: open ? 0 : '100%' }} className="fixed inset-y-0 right-0 z-40 w-72 bg-background p-4 shadow-lg">
          <button onClick={() => setOpen(false)} className="mb-2 rounded-md border px-3 py-1">Close</button>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <input className="w-full rounded-md border px-2 py-1" placeholder="0 - 10 ETH" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Rarity</div>
              <select className="w-full rounded-md border px-2 py-1"><option>Any</option><option>Rare</option><option>Epic</option></select>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
