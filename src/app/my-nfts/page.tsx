"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient, useReadContract } from "wagmi";

import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { fetchOwnedNfts } from "@/lib/owned-nfts";
import { useToast } from "@/components/ui/toast-provider";

export default function MyNftsPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { addToast } = useToast();

  const { data: totalSupplyData } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "totalSupply",
    query: { refetchInterval: 25000 },
  });

  const totalSupply = Number((totalSupplyData as bigint | undefined) ?? BigInt(0));

  const {
    data: ownedNfts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["owned-nfts", address, totalSupply],
    queryFn: () => fetchOwnedNfts({ publicClient: publicClient!, ownerAddress: address!, totalSupply }),
    enabled: Boolean(isConnected && address && publicClient && totalSupply > 0),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (error) {
      addToast({ title: "Could not load your NFTs", description: String(error), type: "error" });
    }
  }, [addToast, error]);

  // Not connected — show prompt
  if (!isConnected) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="font-brush text-4xl">My NFTs</h1>
          <p className="mt-4 text-sm text-foreground/70">
            Connect your wallet to see the HOODIE NFTs you own.
          </p>
          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]">
              BACK HOME
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Connected but no minted NFTs yet
  if (!isLoading && totalSupply === 0) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <main className="mx-auto max-w-7xl px-4 py-12 text-center">
          <div className="mb-6">
            <h1 className="font-brush text-4xl">My NFTs</h1>
            <p className="mt-2 text-sm text-foreground/70">No NFTs have been minted yet.</p>
          </div>
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]">
              MINT YOUR FIRST HOODIE
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-display tracking-[0.2em] text-primary hover:underline">
            <ArrowLeft className="size-4" /> BACK HOME
          </Link>
          <h1 className="mt-4 font-brush text-4xl">My HOODIE NFTs</h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground/80 sm:text-base">
            Tokens owned by {address}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="panel h-64 animate-pulse" />
            ))}
          </div>
        ) : ownedNfts && ownedNfts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {ownedNfts.map((nft) => (
              <article key={nft.tokenId} className="panel overflow-hidden">
                <div className="relative">
                  <img src={nft.image} alt={nft.name} width={768} height={768} className="h-42 w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="mt-1 font-brush text-md">{nft.name} #{nft.tokenId}</div>
                  <p className="mt-2 text-sm text-foreground/70">{nft.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mb-8 flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 py-16 text-center">
            <div className="mb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <ShoppingCart className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="font-brush text-2xl text-foreground">You don't own any HOODIE NFTs yet.</h2>
            <p className="mt-2 max-w-md text-sm text-foreground/70">Mint one or visit the collection to discover more.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]">
                MINT
              </Link>
              <Link href="/collection" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-[11px] font-display tracking-[0.2em]">
                VIEW COLLECTION
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
