"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-display tracking-[0.2em] text-primary hover:underline">
          <ArrowLeft className="size-4" /> BACK HOME
        </Link>
        <h1 className="mt-8 font-brush text-4xl">Owner Admin</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Admin controls are temporarily unavailable while wallet-related flows are removed from the site.
        </p>
      </main>
    </div>
  );
}
