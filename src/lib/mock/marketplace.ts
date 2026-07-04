export type MockListing = {
  tokenId: number;
  name: string;
  image: string;
  priceEth: number;
  seller: string;
  rarity?: string;
  description?: string;
};

const IMG = "/assets/mock-nft.jpg";

export const MOCK_STATS = {
  floorPrice: 0.25,
  totalVolume: 1234.5,
  owners: 512,
  itemsListed: 128,
  totalSales: 820,
  averagePrice: 1.5,
};

export const MOCK_LISTINGS: MockListing[] = Array.from({ length: 24 }).map((_, i) => {
  const rarityPool = ["Common", "Rare", "Epic", "Legendary"] as const;
  const price = ((i % 6) + 1) * 0.25; // deterministic price cycle
  const sellerHex = (i + 1000).toString(16).padStart(40, "0");
  return {
    tokenId: i + 1,
    name: `HOODIE #${i + 1}`,
    image: IMG,
    priceEth: Number(price.toFixed(2)),
    seller: `0x${sellerHex}`,
    rarity: rarityPool[i % rarityPool.length],
    description: "A hoodie forged in the hoods, collectible and stylish.",
  };
});

export const MOCK_ACTIVITY = Array.from({ length: 12 }).map((_, i) => {
  const types = ["Listed", "Sale", "PriceChanged", "Cancelled"] as const;
  const id = i + 1;
  return {
    id,
    type: types[i % types.length],
    tokenId: (i % 24) + 1,
    wallet: `0x${(i + 2000).toString(16).padStart(40, "0")}`,
    price: Number((((i % 8) + 1) * 0.5).toFixed(2)),
    timeAgo: `${(i % 24) + 1}h`,
  };
});

export const MOCK_OWNER = "0xOwnerAddress0000000000000000000000";
