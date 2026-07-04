import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { robinhoodTestnet } from "./chains";

export const rainbowKitConfig = getDefaultConfig({
  appName: "HOODIE",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [robinhoodTestnet],
  ssr: true,
});