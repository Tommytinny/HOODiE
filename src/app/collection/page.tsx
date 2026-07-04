"use client";

import Link from "next/link";
import { ArrowLeft, Coins, Crown, Leaf, Search, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";

import { robinhoodTestnet } from "@/config/chains";
import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { fetchContractNftPage, type IndexedNft, type IndexedNftAttribute } from "@/lib/contract-nfts";
import { Badge } from "@/components/ui/badge";

const emptyImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3E%3Crect width='768' height='768' fill='%23f0ead2'/%3E%3C/svg%3E";

const publicClient = createPublicClient({
  chain: robinhoodTestnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.testnet.robinhood.com"),
});

type Rarity = "common" | "rare" | "legendary";
type SortOption = "newest" | "oldest" | "id-asc" | "id-desc" | "rarity";

type NftCard = {
  id: number;
  tokenId: string;
  name: string;
  image: string;
  rarity: Rarity;
  tag: string;
  description: string;
  attributes: IndexedNftAttribute[];
  createdAt?: string;
};

const rarityOrder: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  legendary: 2,
};

const rarityStyles: Record<Rarity, string> = {
  common: "bg-emerald-600/90 text-white",
  rare: "bg-amber-500/90 text-ink",
  legendary: "bg-primary text-primary-foreground",
};

function normalizeRarity(value: unknown, fallback: Rarity): Rarity {
  const rarity = String(value ?? "").toLowerCase();
  if (rarity === "common" || rarity === "rare" || rarity === "legendary") {
    return rarity;
  }
  return fallback;
}

function formatTokenId(id: number) {
  return `#${String(id).padStart(3, "0")}`;
}

function getAttribute(attributes: IndexedNftAttribute[], traitType: string) {
  return attributes.find((attribute) => attribute.traitType.toLowerCase() === traitType.toLowerCase())?.value;
}

function indexedNftToCard(nft: IndexedNft): NftCard {
  return {
    id: nft.tokenId,
    tokenId: formatTokenId(nft.tokenId),
    name: nft.name,
    image: nft.image,
    rarity: normalizeRarity(getAttribute(nft.attributes, "Rarity"), "common"),
    tag: String(
      getAttribute(nft.attributes, "Background") ??
        getAttribute(nft.attributes, "Tag") ??
        nft.attributes[0]?.value ??
        "HOODIE"
    ),
    description: nft.description,
    attributes: nft.attributes,
    createdAt: nft.createdAt,
  };
}

function getCollectionStatus(salePhase: number) {
  return salePhase === 1 ? "Live" : "Closed";
}

export default function CollectionPage() {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [contractStats, setContractStats] = useState({
    totalSupply: BigInt(0),
    maxSupply: BigInt(0),
    mintPrice: BigInt(0),
    salePhase: 0,
    revealed: false,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [collectionPages, setCollectionPages] = useState<Array<{ nfts: IndexedNft[]; nextCursor?: string }>>([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [collectionQueryError, setCollectionQueryError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);
    setStatsError(null);

    const loadStats = async () => {
      try {
        const [totalSupplyData, maxSupplyData, mintPriceData, salePhaseData, revealedData] = await Promise.all([
          publicClient.readContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "totalSupply" }),
          publicClient.readContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "maxSupply" }),
          publicClient.readContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "mintPrice" }),
          publicClient.readContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "salePhase" }),
          publicClient.readContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "revealed" }),
        ]);

        if (!mounted) return;
        setContractStats({
          totalSupply: (totalSupplyData as bigint) ?? BigInt(0),
          maxSupply: (maxSupplyData as bigint) ?? BigInt(0),
          mintPrice: (mintPriceData as bigint) ?? BigInt(0),
          salePhase: Number((salePhaseData as number | bigint | undefined) ?? 0),
          revealed: Boolean(revealedData),
        });
      } catch (error) {
        if (mounted) {
          setStatsError(error instanceof Error ? error.message : "Could not load collection data.");
        }
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const totalSupply = Number(contractStats.totalSupply);
  const maxSupply = Number(contractStats.maxSupply);
  const salePhase = contractStats.salePhase;
  const isRevealed = contractStats.revealed;

  useEffect(() => {
    let mounted = true;

    const loadCollectionPage = async (cursor?: string) => {
      try {
        if (!mounted) return;
        setIsCollectionLoading(true);
        setCollectionQueryError(null);
        const page = await fetchContractNftPage({ publicClient, totalSupply, cursor });
        if (!mounted) return;
        setCollectionPages((current) => (cursor ? [...current, page] : [page]));
        setHasNextPage(Boolean(page.nextCursor));
      } catch (error) {
        if (!mounted) return;
        setCollectionQueryError(error instanceof Error ? error : new Error("Could not load collection NFTs."));
      } finally {
        if (mounted) setIsCollectionLoading(false);
      }
    };

    if (totalSupply > 0) {
      loadCollectionPage();
    } else {
      setCollectionPages([]);
      setHasNextPage(false);
      setIsCollectionLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [totalSupply]);

  const pricePerUnit = useMemo(() => Number(formatEther(contractStats.mintPrice)), [contractStats.mintPrice]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage && hasNextPage) {
        setIsFetchingNextPage(true);
        fetchContractNftPage({ publicClient, totalSupply, cursor: collectionPages.at(-1)?.nextCursor })
          .then((page) => {
            setCollectionPages((current) => [...current, page]);
            setHasNextPage(Boolean(page.nextCursor));
          })
          .catch((error) => {
            setCollectionQueryError(error instanceof Error ? error : new Error("Could not load collection NFTs."));
          })
          .finally(() => setIsFetchingNextPage(false));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [collectionPages, hasNextPage, isFetchingNextPage, totalSupply]);

  const indexedNfts = useMemo(() => {
    return collectionPages.flatMap((page) => page.nfts).map(indexedNftToCard);
  }, [collectionPages]);

  const visibleNFTs = useMemo(() => {
    let filtered = [...indexedNfts];

    if (selectedRarity !== "all") {
      filtered = filtered.filter((nft) => nft.rarity === selectedRarity);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.tokenId.toLowerCase().includes(query) ||
          nft.name.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.tag.toLowerCase().includes(query)
      );
    }

    switch (sortOrder) {
      case "newest":
        return [...filtered].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      case "oldest":
        return [...filtered].sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      case "id-asc":
        return [...filtered].sort((a, b) => a.id - b.id);
      case "id-desc":
        return [...filtered].sort((a, b) => b.id - a.id);
      case "rarity":
        return [...filtered].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
      default:
        return filtered;
    }
  }, [indexedNfts, selectedRarity, searchQuery, sortOrder]);

  const collectionError = collectionQueryError?.message || (statsError ? statsError : "");
  const maxSupplyLabel = statsLoading ? "..." : String(maxSupply);
  const hasNoMintedNfts = totalSupply === 0 && !isCollectionLoading && !statsLoading;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-display tracking-[0.2em] text-primary hover:underline"
            >
              <ArrowLeft className="size-4" /> BACK HOME
            </Link>
            <h1 className="mt-4 font-brush text-4xl sm:text-5xl">HOODIE Gallery</h1>
            <p className="mt-3 max-w-2xl text-sm text-foreground/80 sm:text-base">
              Browse the official HOODIE gallery with every minted token, rarity, and artwork detail.
            </p>
          </div>

          <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-foreground/80">
            <div className="font-display text-[10px] tracking-[0.25em] text-primary">MINTED</div>
            <div className="mt-1 font-display text-2xl text-foreground">{totalSupply} NFTs</div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { icon: <Leaf className="size-5" />, label: "SUPPLY", value: `${totalSupply} / ${maxSupplyLabel}` },
            { icon: <Coins className="size-5" />, label: "MINT PRICE", value: statsLoading ? "..." : `${pricePerUnit.toFixed(2)} ETH` },
            { icon: <Crown className="size-5" />, label: "REVEAL", value: isRevealed ? "LIVE" : "HIDDEN" },
            { icon: <Zap className="size-5" />, label: "STATUS", value: getCollectionStatus(salePhase) },
          ].map((item, index) => (
            <div key={index} className="panel flex items-center gap-3 overflow-hidden px-4 py-4 md:py-5 relative">
              <div className="absolute inset-0 halftone opacity-30 pointer-events-none" />
              <span className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/15 text-primary md:h-11 md:w-11">
                {item.icon}
              </span>
              <div className="min-w-0">
                <div className="font-display text-[10px] tracking-widest text-muted-foreground">{item.label}</div>
                <div className="font-display text-lg text-foreground md:text-xl">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-primary/20 bg-background/70 p-4">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "common", "rare", "legendary"] as const).map((rarity) => (
                <button
                  key={rarity}
                  type="button"
                  onClick={() => setSelectedRarity(rarity)}
                  className={`rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] transition-all ${
                    selectedRarity === rarity
                      ? "border-ink bg-primary text-primary-foreground"
                      : "border-primary/40 bg-background/60 text-foreground hover:bg-primary/10"
                  }`}
                >
                  {rarity === "all" ? "ALL" : rarity.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedRarity("all")}
              disabled={selectedRarity === "all"}
              className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-background/60 px-3 py-2 text-[11px] font-display tracking-[0.2em] text-foreground transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CLEAR FILTERS
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, name, or trait..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-primary/40 bg-background/60 px-3 py-2 pl-9 text-[11px] font-display tracking-[0.2em] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {([
              { value: "newest", label: "NEWEST" },
              { value: "oldest", label: "OLDEST" },
              { value: "id-asc", label: "ID ↑" },
              { value: "id-desc", label: "ID ↓" },
              { value: "rarity", label: "RARITY" },
            ] as const).map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setSortOrder(filter.value)}
                className={`rounded-full border px-3 py-2 text-[11px] font-display tracking-[0.2em] transition-all whitespace-nowrap ${
                  sortOrder === filter.value
                    ? "border-ink bg-primary text-primary-foreground"
                    : "border-primary/40 bg-background/60 text-foreground hover:bg-primary/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {isCollectionLoading ? (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/80">
            Loading collection metadata...
          </div>
        ) : collectionError ? (
          <div className="mb-6 rounded-lg border border-primary/30 bg-background/70 px-4 py-3 text-sm text-foreground/80">
            {collectionError}
          </div>
        ) : hasNoMintedNfts ? (
          <div className="mb-8 flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 py-16 text-center">
            <div className="mb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Leaf className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="font-brush text-2xl text-foreground">No HOODIE NFTs Minted Yet</h2>
            <p className="mt-2 max-w-md text-sm text-foreground/70">
              The gallery is ready once the first HOODIE token is minted.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
            >
              BACK TO HOME
            </Link>
          </div>
        ) : null}

        {!hasNoMintedNfts && visibleNFTs.length === 0 && !isCollectionLoading && (
          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 px-4 py-8 text-center">
            <p className="text-sm text-foreground/70">
              {searchQuery ? "No NFTs match your search." : "No NFTs match the selected filters."}
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {visibleNFTs.map((nft) => (
            <article key={nft.id} className="panel overflow-hidden">
              <div className="relative">
                <img
                  src={nft.image || emptyImage}
                  alt={nft.name}
                  width={768}
                  height={768}
                  className="h-42 w-full object-cover"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full border border-ink px-2.5 py-1 text-[10px] font-display tracking-[0.25em] ${rarityStyles[nft.rarity]}`}
                >
                  {nft.rarity.toUpperCase()}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mt-1 font-brush text-md">{nft.name} {nft.tokenId}</div>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-3">{nft.description}</p>
                  </div>
                  <Badge className="rounded-full border border-primary/40 bg-background/70 px-2 py-1 text-[10px] font-display tracking-[0.25em] text-foreground">
                    {nft.tag}
                  </Badge>
                </div>

                <div className="mt-4 text-left">
                  <div className="font-display text-[10px] tracking-[0.25em] text-muted-foreground">MINT PRICE</div>
                  <div className="mt-1 font-display text-sm text-primary">
                    {statsLoading ? "..." : `${pricePerUnit.toFixed(2)} ETH`}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
      </main>
    </div>
  );
}
