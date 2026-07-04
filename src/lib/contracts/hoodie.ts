import hoodieContract from "./HOODIE.json";
import type { Address } from "viem";

export const HOODIE_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
    "0x8f11b849ed16ae8a895fe6cce165ba41f491d2a6") as Address;

export const HOODIE_ABI = hoodieContract.abi;