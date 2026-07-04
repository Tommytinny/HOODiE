import { defineChain } from "viem";

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Explorer",
      url: process.env.NEXT_PUBLIC_EXPLORER_URL!,
    },
  },
  testnet: true,
});