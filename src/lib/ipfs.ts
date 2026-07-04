const DEFAULT_IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "";

function normalizeGateway(gateway = DEFAULT_IPFS_GATEWAY) {
  return gateway.trim().replace(/\/+$/, "");
}

export function resolveIpfsUrl(uri?: string | null, gateway = DEFAULT_IPFS_GATEWAY) {
  if (!uri) return "";

  const value = uri.trim();
  if (!value) return "";

  if (value.startsWith("ipfs://")) {
    const ipfsPath = value.replace("ipfs://", "").replace(/^ipfs\//, "");
    return `${normalizeGateway(gateway)}/${ipfsPath}`;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    return value;
  }

  return `${normalizeGateway(gateway)}/${value.replace(/^\/+/, "")}`;
}
