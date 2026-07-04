import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { fetchContractNft, IndexedNft } from "@/lib/contract-nfts";

type ContractPublicClient = {
  readContract: (args: any) => Promise<any>;
};

export async function fetchOwnedNfts({
  publicClient,
  ownerAddress,
  totalSupply,
}: {
  publicClient: ContractPublicClient;
  ownerAddress: string;
  totalSupply: number;
}): Promise<IndexedNft[]> {
  if (!publicClient || !ownerAddress || totalSupply <= 0) return [];

  // Query ownerOf for each token in parallel
  const ownerPromises = Array.from({ length: totalSupply }, (_, i) =>
    publicClient.readContract({
      address: HOODIE_CONTRACT_ADDRESS,
      abi: HOODIE_ABI,
      functionName: "ownerOf",
      args: [BigInt(i + 1)],
    }).then((owner: string) => ({ tokenId: i + 1, owner })).catch(() => ({ tokenId: i + 1, owner: null })),
  );

  const owners = await Promise.all(ownerPromises);

  const ownedTokenIds = owners
    .filter((r) => r.owner && String(r.owner).toLowerCase() === String(ownerAddress).toLowerCase())
    .map((r) => r.tokenId);

  if (ownedTokenIds.length === 0) return [];

  // Fetch metadata for owned tokens in parallel
  const nftPromises = ownedTokenIds.map((id) => fetchContractNft(publicClient, id));

  const nfts = await Promise.allSettled(nftPromises);

  return nfts
    .filter((r): r is PromiseFulfilledResult<IndexedNft> => r.status === "fulfilled")
    .map((r) => r.value);
}
