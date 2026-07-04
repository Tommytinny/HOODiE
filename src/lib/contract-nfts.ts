import { HOODIE_ABI, HOODIE_CONTRACT_ADDRESS } from "@/lib/contracts/hoodie";
import { resolveIpfsUrl } from "@/lib/ipfs";

type ContractPublicClient = {
  readContract: (args: any) => Promise<any>;
};

type FetchContractNftsOptions = {
  cursor?: string;
  pageSize?: number;
  publicClient: ContractPublicClient;
  totalSupply: number;
};

export type IndexedNftAttribute = {
  traitType: string;
  value: string;
};

export type IndexedNft = {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  attributes: IndexedNftAttribute[];
  owner?: string;
  metadata: Record<string, unknown>;
  createdAt?: string;
};

export type IndexedNftPage = {
  nfts: IndexedNft[];
  nextCursor?: string;
};

const PAGE_SIZE = 24;

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getAttributes(metadata: Record<string, unknown>) {
  const attributes = Array.isArray(metadata.attributes) ? metadata.attributes : [];

  return attributes
    .map((attribute) => {
      const record = asRecord(attribute);
      const traitType = asString(record.trait_type) || asString(record.traitType);
      const value = record.value;

      if (!traitType || value === undefined || value === null) return null;

      return {
        traitType,
        value: String(value),
      };
    })
    .filter(Boolean) as IndexedNftAttribute[];
}

async function fetchMetadata(tokenUri: string) {
  const response = await fetch(resolveIpfsUrl(tokenUri));
  if (!response.ok) {
    throw new Error(`Metadata request failed with ${response.status}`);
  }

  return asRecord(await response.json());
}

export async function fetchContractNft(publicClient: ContractPublicClient, tokenId: number): Promise<IndexedNft> {
  try {
    const tokenUri = (await publicClient.readContract({
      address: HOODIE_CONTRACT_ADDRESS,
      abi: HOODIE_ABI,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    })) as string;
    const metadata = await fetchMetadata(tokenUri);
    const attributes = getAttributes(metadata);

    return {
      tokenId,
      name: asString(metadata.name) || `HOODIE #${tokenId}`,
      description: asString(metadata.description),
      image: resolveIpfsUrl(asString(metadata.image)),
      attributes,
      metadata,
    };
  } catch {
    return {
      tokenId,
      name: `HOODIE #${tokenId}`,
      description: "",
      image: "",
      attributes: [],
      metadata: {},
    };
  }
}

export async function fetchContractNftPage({
  cursor,
  pageSize = PAGE_SIZE,
  publicClient,
  totalSupply,
}: FetchContractNftsOptions): Promise<IndexedNftPage> {
  const startTokenId = Number(cursor ?? 1);
  const endTokenId = Math.min(totalSupply, startTokenId + pageSize - 1);

  if (!Number.isFinite(startTokenId) || startTokenId < 1 || startTokenId > totalSupply) {
    return { nfts: [] };
  }

  const nfts = await Promise.all(
    Array.from({ length: endTokenId - startTokenId + 1 }, (_, index) =>
      fetchContractNft(publicClient, startTokenId + index),
    ),
  );

  return {
    nfts,
    nextCursor: endTokenId < totalSupply ? String(endTokenId + 1) : undefined,
  };
}
