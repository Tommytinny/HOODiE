"use client";

//import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createFileRoute } from "@tanstack/react-router";
import type { StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatEther, type Address } from "viem";
//import { useAccount, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  Menu,
  X,
  Wallet,
  Minus,
  Plus,
  ArrowRight,
  Copy,
  ExternalLink,
  Sparkles,
  Leaf,
  Coins,
  Crown,
  Zap,
  ChevronDown,
} from "lucide-react";


import heroImg from "@/assets/hero-hoodie.jpg";
import groupImg from "@/assets/group.png";
import featuredImg from "@/assets/featured.png";
import h1 from "@/assets/hoodie-1.jpg";
import h2 from "@/assets/hoodie-2.jpg";
import h3 from "@/assets/hoodie-3.jpg";
import h4 from "@/assets/hoodie-4.jpg";
import h5 from "@/assets/hoodie-5.jpg";
import h6 from "@/assets/hoodie-6.jpg";
import h7 from "@/assets/hoodie-7.jpg";
import h8 from "@/assets/hoodie-8.jpg";
import robinhood from "@/assets/2221.png";
import alan from "@/assets/alan.jpg";
import sirHiss from "@/assets/98.png";
import littleJohn from "@/assets/little_john.jpg";
import Sword from "@/assets/208.png";
import King from "@/assets/2217.png";
//import { robinhoodTestnet } from "@/config/chains";
import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { useToast } from "@/components/ui/toast-provider";
import Particles from "@/components/particles";
import Navbar from "@/components/navbar";

/*export const Route = createFileRoute("/")({
  component: HoodieLanding,
});*/

const NAV = [
  { label: "HOME", href: "#home" },
  { label: "COLLECTION", href: "/collection" },
  { label: "MY NFTs", href: "/my-nfts" },
  { label: "ABOUT", href: "#about" },
  { label: "ROADMAP", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const mintHref = process.env.NEXT_PUBLIC_MINT_URL || "#mint";
const socialLinks = {
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER_URL || "#",
  discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD_URL || "#",
  opensea: process.env.NEXT_PUBLIC_SOCIAL_OPENSEA_URL || "#",
};

const GALLERY = [
  { src: robinhood, name: "#2221", tag: "MOSS" },
  { src: Sword, name: "#208", tag: "SUN" },
  { src: sirHiss, name: "#98", tag: "VOID" },
  { src: King, name: "#2217", tag: "TIDE" }
];

function getFriendlyMintError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("rejected")) {
    return "The transaction was cancelled in your wallet.";
  }
  if (lower.includes("insufficient funds")) {
    return "You do not have enough funds to complete this mint.";
  }
  if (lower.includes("sale closed") || lower.includes("saleclosed")) {
    return "Minting is currently closed.";
  }
  if (lower.includes("wallet limit") || lower.includes("exceeds wallet")) {
    return "You have reached your wallet mint limit.";
  }
  if (lower.includes("incorrect payment")) {
    return "The payment amount did not match the required mint price.";
  }
  if (lower.includes("max mint") || lower.includes("maxmint")) {
    return "This mint exceeds the allowed quantity for one transaction.";
  }

  return "We could not complete the mint. Please try again in a moment.";
}


export default function Home() {
  return (
    <div className="min-h-dvh jungle-vignette text-foreground overflow-x-clip">
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        {/* <MintSection /> */}
        <About />
        <Gallery />
        <Roadmap />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}


function IconLink({ children, label, href }: { children: React.ReactNode; label: string; href?: string }) {
  const className = "size-10 grid place-items-center rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      aria-label={label}
      className={className}
    >
      {children}
    </button>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.885 3l-.243.507a17.87 17.87 0 0 0-9.284 0L7.115 3A19.79 19.79 0 0 0 3.683 4.369C1.14 8.34.42 12.21.72 16.02a20.15 20.15 0 0 0 5.99 3.03l.79-1.24c-1.05-.4-2.05-.9-2.98-1.5l.24-.19c3.51 1.66 7.33 1.66 10.8 0l.24.19c-.93.6-1.93 1.1-2.98 1.5l.79 1.24c2.14-.68 4.16-1.7 5.99-3.03.36-4.44-.7-8.28-3.28-11.65ZM9.55 14.5c-1.03 0-1.87-.94-1.87-2.09s.82-2.09 1.87-2.09 1.89.95 1.87 2.09c0 1.15-.83 2.09-1.87 2.09Zm4.9 0c-1.03 0-1.87-.94-1.87-2.09s.82-2.09 1.87-2.09 1.89.95 1.87 2.09c0 1.15-.82 2.09-1.87 2.09Z" />
    </svg>
  );
}
function RobinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.9 3.8L12 12 5.1 8.1 12 4.3Z" />
    </svg>
  );
}

function XIcon({ size = 24, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};


function ConnectButton({ full }: { full?: boolean }) {
  /*return (
    <RainbowConnectButton.Custom>
      {({ account, chain, mounted, openConnectModal, openAccountModal }) => {
        const connected = mounted && !!account && !!chain;
        const label = connected
          ? account.displayName || truncateAddress(account.address)
          : "CONNECT WALLET";

        return (
          <button
            type="button"
            onClick={() => {
              if (connected) {
                openAccountModal?.();
              } else {
                openConnectModal?.();
              }
            }}
            className={`relative group inline-flex items-center justify-center gap-2 px-4 py-2.5 font-display text-xs tracking-widest bg-primary text-primary-foreground rounded-md border-2 border-ink shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--ink)] transition-all ${
              full ? "w-full" : ""
            }`}
          >
            <span className="absolute -inset-0.5 rounded-md pulse-slime pointer-events-none" aria-hidden />
            <Wallet className="size-4" />
            {label}
          </button>
        );
      }}
    </RainbowConnectButton.Custom>
  );*/
}

function LogoMark() {
  return (
    <span className="grid place-items-center size-9 rounded-md bg-primary text-primary-foreground border-2 border-ink shadow-[3px_3px_0_0_var(--ink)]">
      <Leaf className="size-5" strokeWidth={2.5} />
    </span>
  );
}



/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-10 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 relative z-10">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/40 text-primary text-[11px] font-display tracking-widest">
              <Sparkles className="size-3.5" /> MINT LIVE ON ROBINHOOD CHAIN
            </div> */}
            <h1 className="mt-5 font-display leading-[0.95] text-3xl sm:text-4xl md:text-5xl">
              <span className="block outline-comic tracking-wide">BORN FROM DIFFERENT</span>
              <span className="block brush text-[2.5rem] sm:text-7xl md:text-[7rem] -mt-1 leading-none">
                HOODS
              </span>
              <span className="block outline-comic tracking-wide mt-2">BOUND BY ONE</span>
              <span className="block brush text-[2.75rem] sm:text-7xl md:text-[3.5rem] leading-none">
                BROTHERHOOD
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-sm md:text-base text-foreground/85 leading-relaxed">
              <span className="text-primary font-semibold">2222</span> unique{" "}
              <span className="font-brush text-primary">HOODIE</span> NFTs on Robinhood Chain.
              More than a collection. It's a movement.
              <br />
              The hood does not conceal who you are.
              <br />
              It reveals what you stand for.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              <a
                href={mintHref}
                className="inline-flex min-w-[180px] items-center justify-center gap-2 px-5 py-3 font-display text-sm tracking-widest bg-primary text-primary-foreground rounded-md border-2 border-ink shadow-[5px_5px_0_0_#007017] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                JOIN THE BROTHERHOOD <Leaf className="size-4" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[180px] items-center justify-center gap-2 px-5 py-3 font-display text-sm tracking-widest text-primary border-2 border-primary/70 rounded-md hover:bg-primary/10 transition-all w-full sm:w-auto"
              >
                FOLLOW ON <svg viewBox="0 0 24 24" fill="currentColor" width={10} height={10} className="size-3 text-white" aria-hidden>
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L.826 2.25H7.85l4.708 6.257L18.244 2.25zm-1.165 18.75h1.833L7.169 4.126H5.166l11.913 16.874z" />
</svg>
              </a>
            </div>
          </div>

          {/* Hero art */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border-[3px] border-ink shadow-[10px_10px_0_0_var(--ink)]">
              <img
          src={featuredImg.src}
          alt="Featured HOODIE — Jungle Phantom"
          width={768}
          height={768}
          loading="lazy"
          className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
        />
              <div className="absolute inset-0 halftone opacity-40 mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              
            </div>
            {/* floating badge */}
            <div className="hidden md:flex float-slow absolute -left-6 top-10 z-10 items-center gap-2 px-3 py-2 bg-card border-2 border-ink rounded-md shadow-[4px_4px_0_0_var(--ink)]">
              <Crown className="size-4 text-primary" />
              <span className="font-display text-[10px] tracking-widest">LEGENDARY</span>
            </div>
          </div>
        </div>
      </div>
      {/* leaf decor */}
      <Leaf
        aria-hidden
        className="absolute -left-6 top-24 size-24 text-primary/20 -rotate-12 pointer-events-none"
      />
      <Leaf
        aria-hidden
        className="absolute right-2 bottom-4 size-20 text-primary/15 rotate-45 pointer-events-none"
      />
    </section>
  );
}

/* ---------------- Stats ---------------- */
function StatsStrip() {
  /*const { data: totalSupplyData, isLoading: isTotalSupplyLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "totalSupply",
  });
  const { data: maxSupplyData, isLoading: isMaxSupplyLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "maxSupply",
  });
  const { data: mintPriceData, isLoading: isMintPriceLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "mintPrice",
  });

  const totalSupply = Number((totalSupplyData as bigint | undefined) ?? BigInt(0));
  const maxSupply = Number((maxSupplyData as bigint | undefined) ?? BigInt(2222));
  const mintPriceBigInt = (mintPriceData as bigint | undefined) ?? BigInt(0);
  const pricePerUnit = Number(formatEther(mintPriceBigInt));*/

  /*const items = [
    {
      icon: <Leaf className="size-5" />,
      label: "SUPPLY",
      value: isTotalSupplyLoading || isMaxSupplyLoading ? "… / 2222" : `${totalSupply} / ${maxSupply}`,
    },
    {
      icon: <Coins className="size-5" />,
      label: "PRICE",
      value: isMintPriceLoading ? "…" : `${pricePerUnit.toFixed(2)} ETH`,
    },
    {
      icon: <Crown className="size-5" />,
      label: "MINTED",
      value: <Counter to={totalSupply} />,
    },
    {
      icon: <Zap className="size-5" />,
      label: "NETWORK",
      value: "ROBINHOOD",
    },
  ];*/

  const items = [
    {
      icon: <Leaf className="size-5" />,
      label: "SUPPLY",
      value: "2,222",
    },
    {
      icon: <Coins className="size-5" />,
      label: "PRICE",
      value: 0.002 + " ETH",
    },
    {
      icon: <Crown className="size-5" />,
      label: "ON-CHAIN",
      value: 100 + "%",
    },
    {
      icon: <Zap className="size-5" />,
      label: "NETWORK",
      value: "ROBINHOOD",
    },
  ];
  
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((s, i) => (
            <div
              key={i}
              className="panel px-4 py-4 md:py-5 flex items-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 halftone opacity-30 pointer-events-none" />
              <span className="grid place-items-center size-10 md:size-11 rounded-md bg-primary/15 text-primary border border-primary/40">
                {s.icon}
              </span>
              <div className="min-w-0">
                <div className="font-display text-[10px] tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="font-display text-lg md:text-xl text-foreground truncate">
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}</span>;
}

/* ---------------- Mint Section (3 panels) ---------------- */
function MintSection() {
  return (
    <section id="mint" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <FeaturedCard />
          {/*<MintCard />*/}
          <GroupPanel />
        </div>
      </div>
    </section>
  );
}

function FeaturedCard() {
  return (
    <article className="panel p-3 md:p-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span className="px-2.5 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-widest border-2 border-ink shadow-[3px_3px_0_0_var(--ink)] rotate-[-2deg]">
          FEATURED HOODIE
        </span>
        <span className="font-display text-[10px] tracking-widest text-primary">#001</span>
      </div>
      <div className="relative rounded-lg overflow-hidden border-2 border-ink">
        <img
          src={featuredImg.src}
          alt="Featured HOODIE — Jungle Phantom"
          width={768}
          height={768}
          loading="lazy"
          className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 halftone opacity-30 mix-blend-overlay pointer-events-none" />
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur border border-primary/50 rounded font-display text-[10px] tracking-widest text-primary">
          LEGENDARY
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="font-brush text-xl brush leading-none">Jungle Phantom</div>
          <div className="text-xs text-muted-foreground mt-1">Rarity 1 / 2222</div>
        </div>
        <span className="font-display text-xs text-primary">0.05 ETH</span>
      </div>
    </article>
  );
}

function MintCard() {
  /*const [qty, setQty] = useState(1);
  const { addToast } = useToast();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: mintPriceData, isLoading: isMintPriceLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "mintPrice",
  });
  const { data: maxMintPerTxData, isLoading: isMaxMintLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "maxMintPerTx",
  });
  const { data: salePhaseData, isLoading: isSalePhaseLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "salePhase",
  });
  const { writeContract, isPending, error, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const maxPerTx = maxMintPerTxData ? Number(maxMintPerTxData) : 10;
  const mintPriceKnown = mintPriceData !== undefined && mintPriceData !== null;
  const mintPriceBigInt = (mintPriceData as bigint | undefined) ?? BigInt(0);
  const salePhase = Number((salePhaseData as number | undefined) ?? 0);
  const isSaleOpen = salePhase === 1;
  const pricePerUnit = mintPriceKnown ? Number(formatEther(mintPriceBigInt)) : 0.003;
  const total = (Math.min(Math.max(1, qty), maxPerTx) * pricePerUnit).toFixed(2);
  const isCorrectChain = chainId === robinhoodTestnet.id;
  const networkName = robinhoodTestnet.name.replace(/\s+Testnet$/i, "");
  const explorerUrl = txHash ? `${robinhoodTestnet.blockExplorers.default.url}/tx/${txHash}` : undefined;

  useEffect(() => {
    setQty((current) => Math.min(maxPerTx, Math.max(1, current)));
  }, [maxPerTx]);

  useEffect(() => {
    if (!error) return;
    addToast({
      title: "Mint failed",
      description: getFriendlyMintError(error.message),
      type: "error",
    });
  }, [addToast, error]);

  useEffect(() => {
    if (!isSuccess || !txHash) return;
    addToast({
      title: "Mint confirmed",
      description: "Your hoodie mint is now on-chain.",
      type: "success",
    });
  }, [addToast, isSuccess, txHash]);

  const handleMint = () => {
    if (!isConnected || !address) {
      addToast({
        title: "Wallet required",
        description: "Connect your wallet to mint a hoodie.",
        type: "error",
      });
      return;
    }
    if (!isCorrectChain) {
      addToast({
        title: "Switch network",
        description: `Please switch to ${networkName} to continue.`,
        type: "error",
      });
      switchChain?.({ chainId: robinhoodTestnet.id });
      return;
    }
    if (!mintPriceKnown) {
      addToast({
        title: "Mint unavailable",
        description: "The contract is not ready for minting yet.",
        type: "error",
      });
      return;
    }

    writeContract({
      address: HOODIE_CONTRACT_ADDRESS,
      abi: HOODIE_ABI,
      functionName: "mint",
      args: [BigInt(Math.min(Math.max(1, qty), maxPerTx))],
      value: BigInt(Math.min(Math.max(1, qty), maxPerTx)) * mintPriceBigInt,
    });
  };

  return (
    <article className="panel p-5 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />
      <h3 className="font-brush brush text-3xl md:text-4xl">Mint Your Hoodie</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Every mint is a member of the Brotherhood.
      </p>

      <div className="mt-5">
        <label className="font-display text-[10px] tracking-widest text-muted-foreground">
          QUANTITY
        </label>
        <div className="mt-2 flex items-center gap-2 p-2 rounded-lg border-2 border-ink bg-background/60">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="size-10 grid place-items-center rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/40"
          >
            <Minus className="size-4" />
          </button>
          <input
            aria-label="Mint quantity"
            value={qty}
            onChange={(e) => {
              const n = parseInt(e.target.value || "1", 10);
              if (!isNaN(n)) setQty(Math.max(1, Math.min(maxPerTx, n)));
            }}
            className="flex-1 bg-transparent text-center font-display text-2xl text-foreground focus:outline-none"
          />
          <button
            onClick={() => setQty((q) => Math.min(maxPerTx, q + 1))}
            aria-label="Increase quantity"
            className="size-10 grid place-items-center rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="font-display text-[10px] tracking-widest text-muted-foreground">
          TOTAL
        </span>
        <span className="font-display text-2xl text-primary">
          {total} <span className="text-xs text-muted-foreground">ETH</span>
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-primary/25 bg-background/70 p-3 text-[11px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Price per hoodie</span>
          <span className="font-display text-sm text-foreground">
            {isMintPriceLoading ? "…" : `${pricePerUnit.toFixed(2)} ETH`}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>Network</span>
          <span className="font-display text-[10px] tracking-widest uppercase text-primary">
            {isCorrectChain ? networkName : "Switch network"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>Sale status</span>
          <span className="font-display text-[10px] tracking-widest uppercase text-primary">
            {isSalePhaseLoading ? "…" : isSaleOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>

      <div className="mt-5">
        {!isConnected ? (
          <ConnectButton full />
        ) : (
          <button
            type="button"
            onClick={handleMint}
            disabled={isPending || isConfirming || !mintPriceKnown || !isSaleOpen || !isCorrectChain}
            className="relative group inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-3 font-display text-xs tracking-widest text-primary-foreground shadow-[4px_4px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="absolute -inset-0.5 rounded-md pulse-slime pointer-events-none" aria-hidden />
            {isPending || isConfirming
              ? "MINTING..."
              : !isCorrectChain
              ? "SWITCH NETWORK"
              : !isSaleOpen
              ? "SALE CLOSED"
              : "MINT NOW"}
          </button>
        )}
      </div>

      {isConnected && address ? (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Connected {address.slice(0, 6)}…{address.slice(-4)}
        </p>
      ) : null}

      {!isCorrectChain && isConnected ? (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Switch to {networkName} to enable minting.
        </p>
      ) : !isSaleOpen && !isSalePhaseLoading ? (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Minting is not open yet. Check back when the public sale begins.
        </p>
      ) : null}

      {isSuccess && txHash ? (
        <div className="mt-3 rounded-lg border border-primary/35 bg-primary/10 p-3 text-left">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-4 text-primary" />
            <div className="min-w-0">
              <p className="font-display text-[10px] tracking-widest text-primary">MINT CONFIRMED</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Your hoodie mint is now on-chain. You can track it instantly below.
              </p>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-display text-[10px] tracking-widest text-primary hover:underline"
              >
                VIEW ON EXPLORER <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Max {maxPerTx} per transaction • Max 10 per wallet
      </p>
    </article>
  );*/
}

function GroupPanel() {
  return (
    <article className="panel relative overflow-hidden">
      <img
        src={groupImg.src}
        alt="Hooded characters standing together in the jungle"
        width={1024}
        height={1024}
        loading="lazy"
        className="w-full h-full object-cover aspect-square"
      />
      <div className="absolute inset-0 halftone opacity-25 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="absolute left-4 right-4 bottom-4">
        <div className="inline-block px-3 py-2 bg-cream text-ink font-brush text-lg rotate-[-2deg] border-2 border-ink shadow-[4px_4px_0_0_var(--ink)]">
          "From the jungle, we rise."
        </div>
      </div>
    </article>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery() {
  return (
    <section id="collection" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-widest border-2 border-ink shadow-[3px_3px_0_0_var(--ink)] rotate-[-2deg]">
              CHAPTER 02
            </span>
            <h2 className="mt-3 font-brush brush text-4xl md:text-6xl">Hoodies of the Jungle</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.map((g, i) => (
            <GalleryCard key={i} src={g.src} name={g.name} tag={g.tag} />
          ))}
        </div>

        
      </div>
    </section>
  );
}

function GalleryCard({ src, name, tag }: { src: StaticImageData; name: string; tag: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="group relative panel p-2 overflow-hidden hover:-translate-y-1 transition-transform">
      <div className="relative rounded-md overflow-hidden border-2 border-ink aspect-square bg-secondary">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
        <img
          src={src.src}
          alt={`HOODIE ${name}`}
          width={512}
          height={512}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-105`}
        />
        <div className="absolute inset-0 halftone opacity-20 mix-blend-overlay pointer-events-none" />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-display tracking-widest bg-background/80 text-primary border border-primary/50 rounded">
          {tag}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between px-1 pb-1">
        <span className="font-display text-xs">HOODIE {name}</span>
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="about" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 panel p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-widest border-2 border-ink shadow-[3px_3px_0_0_var(--ink)] rotate-[-2deg]">
            ORIGIN STORY
          </span>
          <h2 className="mt-4 font-brush brush text-4xl md:text-5xl">The Brotherhood</h2>
          <p className="mt-4 text-sm md:text-base text-foreground/85 leading-relaxed">
            The HOODIE collection brings together 2,222 hand-crafted jungle characters, each with their own personality, colors, history, and unique traits. Inspired by legends of loyalty, courage, mischief, and adventure, every NFT represents a member of a thriving woodland society.
            Some are fearless leaders. Some are clever tricksters. Some protect the forest, while others seek to rule it. 
            <br/>Though every character has a different story, they all belong to the same world—a jungle where friendship, rivalry, and adventure shape every path.
            <br/>No two HOODIEs are exactly alike, but together they form one community, one collection, and one brotherhood.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { k: "2,222", v: "SUPPLY" },
              { k: "300+", v: "TRAITS" },
              { k: "100%", v: "ON-CHAIN" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-lg border-2 border-primary/40 bg-background/40 p-4 text-center"
              >
                <div className="font-display text-2xl text-primary">{s.k}</div>
                <div className="font-display text-[10px] tracking-widest text-muted-foreground mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border-[3px] border-ink shadow-[8px_8px_0_0_var(--ink)]">
            <img
              src={groupImg.src}
              alt="Hooded characters standing together in the jungle"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover aspect-square"
            />
            <div className="absolute inset-0 halftone opacity-30 mix-blend-overlay pointer-events-none" />
          </div>
          <div className="absolute left-4 right-4 bottom-4">
        <div className="inline-block px-3 py-2 bg-cream text-ink font-brush text-lg rotate-[-2deg] border-2 border-ink shadow-[4px_4px_0_0_var(--ink)]">
          "From the jungle, we rise."
        </div>
      </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Roadmap ---------------- */
function Roadmap() {
  const steps = [
    {
      title: "The Gathering",
      body: "The forest awakens as the HOODIE collection makes its debut. Early supporters become the first guardians of the ecosystem, the collection is revealed, and the community begins to grow around a shared vision. This is where the story begins.",
    },
    {
      title: "The Brotherhood",
      body: "As the community grows stronger, ownership becomes more than holding an NFT—it becomes belonging. Exclusive experiences, community events, collaborations, and holder rewards deepen the connection between every guardian and the world of HOODIE.",
    },
    {
      title: "The Legacy",
      body: "The journey extends beyond a single collection. New stories unfold, new characters emerge, and the HOODIE universe continues to expand through future releases, partnerships, and long-term community-driven experiences.",
    },
  ];
  return (
    <section id="roadmap" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-widest border-2 border-ink shadow-[3px_3px_0_0_var(--ink)] rotate-[-2deg]">
            THE PATH
          </span>
          <h2 className="mt-3 font-brush brush text-4xl md:text-6xl">The Journey</h2>
        </div>
        <div className="grid items-center md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="panel p-5 relative overflow-hidden">
              <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />
              <div className="flex items-center font-display text-primary mb-2 font-bold text-[11px] tracking-widest">
                <div className="mt-1 font-brush text-2xl text-foreground pr-2">0{i + 1}.</div>
                {s.title}
              </div>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [ 
    { 
      q: "What is HOODIE?", 
      a: "HOODIE is a collection of 2,222 hand-crafted jungle characters inspired by timeless tales of adventure, loyalty, and mischief. Built on Robinhood Chain, every NFT is uniquely generated from carefully illustrated traits and welcomes its holder into the Brotherhood.", 
    }, 
    { 
      q: "How do I mint a HOODIE?", 
      a: "Minting takes place through our official launch experience powered by OpenSea. Simply connect your wallet, choose the number of NFTs you'd like to mint, and approve the transaction. Live mint pricing and availability are displayed during the mint process.", 
    }, 
    { 
      q: "Which blockchain is HOODIE on?", 
      a: "HOODIE is deployed on Robinhood Chain. You can connect using any supported EVM-compatible wallet, including MetaMask, Rabby, Coinbase Wallet, and WalletConnect-compatible wallets.", 
    }, 
    { q: "Where can I buy or sell HOODIE NFTs?", 
      a: "After minting, HOODIE NFTs can be viewed, bought, and traded on OpenSea, which serves as the official secondary marketplace for the collection. Our website remains the official hub for exploring the collection, discovering artwork, and following the HOODIE journey.", 
    }, 
    {
      q: "What happens after I mint?",
      a: "Once your transaction is confirmed, your HOODIE NFT will appear in your connected wallet and in your OpenSea profile. After the collection is revealed, you'll be able to view its unique artwork, traits, and metadata."
    },
  ];
  return (
    <section id="faq" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-widest border-2 border-ink shadow-[3px_3px_0_0_var(--ink)] rotate-[-2deg]">
            QUESTIONS
          </span>
          <h2 className="mt-3 font-brush brush text-4xl md:text-6xl">FAQ</h2>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <FAQItem key={i} q={it.q} a={it.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-sm md:text-base tracking-wide">{q}</span>
        <ChevronDown
          className={`size-5 text-primary shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={ref}
        style={{
          maxHeight: open ? ref.current?.scrollHeight ?? 300 : 0,
        }}
        className="overflow-hidden transition-[max-height] duration-300"
      >
        <div className="px-5 pb-5 text-sm text-foreground/80 leading-relaxed border-t border-border">
          <p className="pt-3">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const [copied, setCopied] = useState(false);
  const address = HOODIE_CONTRACT_ADDRESS;
  //const explorerUrl = `${robinhoodTestnet.blockExplorers.default.url}/address/${HOODIE_CONTRACT_ADDRESS}`;
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(HOODIE_CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <footer className="relative mt-10 border-t-2 border-primary/40 bg-jungle-deep">
      <div className="absolute inset-0 halftone opacity-15 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-brush text-4xl brush">HOODIE</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground max-w-xs">
            © {new Date().getFullYear()} HOODIE. All rights reserved. From the jungle, we rise.
          </p>
        </div>

        <div>
          <div className="font-display text-[10px] tracking-widest text-primary">ABOUT HOODIE</div>
          <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
            A collection of 2222 unique{" "}
            <span className="font-brush text-primary">HOODIE</span> NFTs living on Robinhood Chain.
            Built for the community. Owned by the Brotherhood.
          </p>
        </div>

        <div>
          <div className="font-display text-[10px] tracking-widest text-primary">CONTRACT</div>
          <button
            onClick={onCopy}
            className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-md border-2 border-primary/40 bg-background/50 hover:bg-primary/10 transition-colors font-mono text-xs"
          >
            {truncateAddress(address)}
            <Copy className="size-3.5" />
            {copied && <span className="text-primary">copied</span>}
          </button>
          
        </div>

        <div>
          <div className="font-display text-[10px] tracking-widest text-primary">
            FOLLOW THE BROTHERHOOD
          </div>
          <div className="mt-3 flex items-center gap-2">
            <IconLink label="Twitter" href={socialLinks.twitter}><svg viewBox="0 0 24 24" fill="currentColor" width={32} height={32} className="size-4" aria-hidden>
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L.826 2.25H7.85l4.708 6.257L18.244 2.25zm-1.165 18.75h1.833L7.169 4.126H5.166l11.913 16.874z" />
</svg></IconLink>
            <IconLink label="Discord" href={socialLinks.discord}><DiscordIcon /></IconLink>
            <IconLink label="OpenSea" href={socialLinks.opensea}><RobinIcon /></IconLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

