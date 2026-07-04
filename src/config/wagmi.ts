import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { robinhoodTestnet } from "./chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

export const wagmiConfig = createConfig({
  chains: [robinhoodTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: "HOODIE",
        description: "HOODIE NFT collection",
        url: "https://hoodie.example",
        icons: ["https://hoodie.example/icon.png"],
      },
    }),
  ],
  transports: {
    [robinhoodTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.testnet.robinhood.com"),
  },
  ssr: true,
});