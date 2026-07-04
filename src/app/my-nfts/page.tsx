"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MyNftsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-display tracking-[0.2em] text-primary hover:underline">
          <ArrowLeft className="size-4" /> BACK HOME
        </Link>
        <h1 className="mt-8 font-brush text-4xl">My NFTs</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Wallet-based ownership lookup has been removed while we simplify the site experience.
        </p>
        <div className="mt-8">
          <Link href="/collection" className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]">
            VIEW COLLECTION
          </Link>
        </div>
      </main>
    </div>
  );
}
