"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { parseEther, formatEther } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useSwitchChain,
} from "wagmi";

import { robinhoodTestnet } from "@/config/chains";
import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { useToast } from "@/components/ui/toast-provider";

function AdminField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-background/70 p-3">
      <div className="font-display text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-sm text-foreground">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const { addToast } = useToast();

  const { data: ownerData, isLoading: isOwnerLoading } = useReadContract({
    address: HOODIE_CONTRACT_ADDRESS,
    abi: HOODIE_ABI,
    functionName: "owner",
    query: { refetchInterval: 25000 },
  });

  const owner = (ownerData as string | undefined) ?? undefined;

  // Read stats
  const { data: nameData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "name", query: { refetchInterval: 25000 } });
  const { data: salePhaseData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "salePhase", query: { refetchInterval: 25000 } });
  const { data: revealedData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "revealed", query: { refetchInterval: 25000 } });
  const { data: mintPriceData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "mintPrice", query: { refetchInterval: 25000 } });
  const { data: totalSupplyData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "totalSupply", query: { refetchInterval: 25000 } });
  const { data: maxSupplyData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "maxSupply", query: { refetchInterval: 25000 } });
  const { data: maxMintPerTxData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "maxMintPerTx", query: { refetchInterval: 25000 } });
  const { data: maxMintPerWalletData } = useReadContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "maxMintPerWallet", query: { refetchInterval: 25000 } });
  const name = (nameData as string | undefined) ?? "HOODIE";
  const salePhase = Number((salePhaseData as number | undefined) ?? 0);
  const isRevealed = Boolean(revealedData);
  const mintPrice = (mintPriceData as bigint | undefined) ?? (0 as unknown as bigint);
  const totalSupply = Number((totalSupplyData as bigint | undefined) ?? (0 as unknown as bigint));
  const maxSupply = Number((maxSupplyData as bigint | undefined) ?? (0 as unknown as bigint));
  const maxMintPerTx = Number((maxMintPerTxData as number | undefined) ?? 0);
  const maxMintPerWallet = Number((maxMintPerWalletData as number | undefined) ?? 0);

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Single write hook used for actions; track txHash to show status
  const { writeContract, isPending: isWriting, error: writeError, data: writeData } = useWriteContract();

  useEffect(() => {
    if (writeError) addToast({ title: "Transaction failed", description: writeError.message, type: "error" });
  }, [writeError, addToast]);

  useEffect(() => {
    if (!isTxSuccess || !txHash) return;
    addToast({ title: "Transaction confirmed", description: txHash, type: "success" });
  }, [isTxSuccess, txHash, addToast]);

  // Balance via publicClient
  const [balance, setBalance] = useState<bigint | null>(null);
  useEffect(() => {
    if (!publicClient) return;
    let mounted = true;
    (async () => {
      try {
        const b = await publicClient.getBalance({ address: HOODIE_CONTRACT_ADDRESS });
        if (mounted) setBalance(b);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [publicClient, txHash]);

  // Form state
  const [newMintPrice, setNewMintPrice] = useState<string>("");
  const [newMaxPerTx, setNewMaxPerTx] = useState<string>(String(maxMintPerTx || 0));
  const [newMaxPerWallet, setNewMaxPerWallet] = useState<string>(String(maxMintPerWallet || 0));
  const [hiddenUri, setHiddenUri] = useState<string>("");
  const [baseUri, setBaseUri] = useState<string>("");
  const [ownerMintTo, setOwnerMintTo] = useState<string>("");
  const [ownerMintQty, setOwnerMintQty] = useState<number>(1);

  // Actions
  const setSalePhase = (phase: number) => {
    if (chainId !== robinhoodTestnet.id) {
      addToast({ title: "Wrong network", description: "Switch to Robinhood Testnet", type: "error" });
      switchChain?.({ chainId: robinhoodTestnet.id });
      return;
    }
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setSalePhase", args: [phase] });
  };

  const handleSetMintPrice = () => {
    if (!newMintPrice) return addToast({ title: "Invalid price", description: "Enter a valid ETH amount", type: "error" });
    try {
      const wei = parseEther(newMintPrice);
      writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setMintPrice", args: [wei] });
    } catch (e: any) {
      addToast({ title: "Invalid price", description: e.message || String(e), type: "error" });
    }
  };

  const handleSetMaxPerTx = () => {
    const v = Number(newMaxPerTx);
    if (!Number.isFinite(v) || v <= 0) return addToast({ title: "Invalid input", description: "Enter a number > 0", type: "error" });
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setMaxMintPerTx", args: [BigInt(v)] });
  };

  const handleSetMaxPerWallet = () => {
    const v = Number(newMaxPerWallet);
    if (!Number.isFinite(v) || v <= 0) return addToast({ title: "Invalid input", description: "Enter a number > 0", type: "error" });
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setMaxMintPerWallet", args: [BigInt(v)] });
  };

  const handleSetHiddenUri = () => {
    if (!hiddenUri.trim()) return addToast({ title: "Invalid URI", description: "Hidden URI cannot be empty", type: "error" });
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setHiddenURI", args: [hiddenUri.trim()] });
  };

  const handleSetBaseUri = () => {
    if (!baseUri.trim()) return addToast({ title: "Invalid URI", description: "Base URI cannot be empty", type: "error" });
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "setBaseURI", args: [baseUri.trim()] });
  };

  const handleReveal = () => writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "reveal" });

  const handleOwnerMint = () => {
    if (!ownerMintTo || ownerMintQty <= 0) return addToast({ title: "Invalid input", description: "Provide recipient and qty", type: "error" });
    writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "ownerMint", args: [ownerMintTo, BigInt(ownerMintQty)] });
  };

  const handleWithdraw = () => writeContract({ address: HOODIE_CONTRACT_ADDRESS, abi: HOODIE_ABI, functionName: "withdraw" });

  // Track last tx hash from writeData if present
  useEffect(() => {
    if (!writeData) return;
    // writeData may be an object with hash
    const h = (writeData as any)?.hash ?? (Array.isArray(writeData) ? (writeData[0]?.hash) : undefined);
    if (h) setTxHash(String(h) as `0x${string}`);
  }, [writeData]);

  // Basic access control
  if (!isConnected) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="font-brush text-4xl">Owner Admin</h1>
          <p className="mt-4 text-sm text-foreground/70">Connect the contract owner wallet to access admin controls.</p>
        </main>
      </div>
    );
  }

  if (!isOwnerLoading && owner && address && owner.toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="font-brush text-4xl">Access Denied</h1>
          <p className="mt-4 text-sm text-foreground/70">You are not the collection owner.</p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-primary px-4 py-2 text-[11px] font-display tracking-[0.2em] text-primary-foreground">BACK HOME</Link>
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
          <h1 className="mt-4 font-brush text-4xl">Owner Admin Dashboard</h1>
          <p className="mt-3 text-sm text-foreground/80">Manage the HOODIE collection. Owner-only controls.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <AdminField label="Collection" value={name} />
          <AdminField label="Contract" value={HOODIE_CONTRACT_ADDRESS} />
          <AdminField label="Owner" value={owner ?? "..."} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <AdminField label="Sale Phase" value={salePhase === 1 ? "PUBLIC" : "CLOSED"} />
          <AdminField label="Reveal" value={isRevealed ? "REVEALED" : "HIDDEN"} />
          <AdminField label="Contract Balance" value={balance ? `${formatEther(balance)} ETH` : "..."} />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Sale Controls</h2>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setSalePhase(0)} disabled={isWriting} className="rounded-md border px-3 py-2">Set Closed</button>
              <button onClick={() => setSalePhase(1)} disabled={isWriting} className="rounded-md border px-3 py-2">Set Public</button>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Mint Price</h2>
            <div className="mt-3 flex gap-2">
              <input value={newMintPrice} onChange={(e) => setNewMintPrice(e.target.value)} placeholder={formatEther(mintPrice) ?? "0.00"} className="flex-1 rounded-md border px-3 py-2" />
              <button onClick={handleSetMintPrice} disabled={isWriting} className="rounded-md border px-3 py-2">Set Price</button>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Mint Limits</h2>
            <div className="mt-3 flex gap-2">
              <input value={newMaxPerTx} onChange={(e) => setNewMaxPerTx(e.target.value)} placeholder={String(maxMintPerTx)} className="rounded-md border px-3 py-2" />
              <button onClick={handleSetMaxPerTx} disabled={isWriting} className="rounded-md border px-3 py-2">Set</button>
            </div>
            <div className="mt-3 flex gap-2">
              <input value={newMaxPerWallet} onChange={(e) => setNewMaxPerWallet(e.target.value)} placeholder={String(maxMintPerWallet)} className="rounded-md border px-3 py-2" />
              <button onClick={handleSetMaxPerWallet} disabled={isWriting} className="rounded-md border px-3 py-2">Set</button>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Metadata</h2>
            <div className="mt-3">
              <input value={hiddenUri} onChange={(e) => setHiddenUri(e.target.value)} placeholder="ipfs://.../hidden.json" className="w-full rounded-md border px-3 py-2" />
              <div className="mt-2 flex gap-2">
                <button onClick={handleSetHiddenUri} disabled={isWriting} className="rounded-md border px-3 py-2">Set Hidden URI</button>
              </div>
            </div>
            <div className="mt-3">
              <input value={baseUri} onChange={(e) => setBaseUri(e.target.value)} placeholder="ipfs://bafy.../" className="w-full rounded-md border px-3 py-2" />
              <div className="mt-2 flex gap-2">
                <button onClick={handleSetBaseUri} disabled={isWriting} className="rounded-md border px-3 py-2">Set Base URI</button>
              </div>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Reveal</h2>
            <div className="mt-3">
              <div className="mb-2">Status: {isRevealed ? "Revealed" : "Hidden"}</div>
              <button onClick={handleReveal} disabled={isRevealed || isWriting} className="rounded-md border px-3 py-2">Reveal Collection</button>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Owner Mint</h2>
            <input value={ownerMintTo} onChange={(e) => setOwnerMintTo(e.target.value)} placeholder="recipient address" className="w-full rounded-md border px-3 py-2" />
            <input value={ownerMintQty} onChange={(e) => setOwnerMintQty(Number(e.target.value))} type="number" min={1} className="w-24 mt-2 rounded-md border px-3 py-2" />
            <div className="mt-2"><button onClick={handleOwnerMint} disabled={isWriting} className="rounded-md border px-3 py-2">Mint</button></div>
          </section>

          <section className="panel p-4">
            <h2 className="font-display text-sm text-primary">Withdraw</h2>
            <div className="mt-3">Balance: {balance ? `${formatEther(balance)} ETH` : "..."}</div>
            <div className="mt-2"><button onClick={handleWithdraw} disabled={isWriting} className="rounded-md border px-3 py-2">Withdraw</button></div>
          </section>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          {txHash && (
            <div>
              Transaction: <a href={`${robinhoodTestnet.blockExplorers?.default?.url}/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-primary underline">{txHash}</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
