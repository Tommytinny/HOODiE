# NFT Indexer Setup Guide

## Overview

The HOODIE Collection Page has been refactored to use an **OpenSea-style architecture** where:

- **Only minted NFTs** are displayed (no token ID scanning)
- **NFT Indexer** is the primary data source
- **Smart Contract** is used only for live collection state
- **Pagination** prevents loading all NFTs at once
- **Search, Filters, and Sorting** operate on indexed data

## Required Configuration

### 1. Set Environment Variable

Add `NEXT_PUBLIC_NFT_INDEXER_URL` to your `.env.local`:

```env
NEXT_PUBLIC_NFT_INDEXER_URL=https://api.alchemy.com/nft/v3/{YOUR-API-KEY}/getNFTsForCollection
```

**Replace `{YOUR-API-KEY}`** with your actual API key.

### 2. Get an API Key

Choose one of the supported indexers:

#### Option A: Alchemy (Recommended)

1. Go to https://www.alchemy.com/
2. Sign up or log in
3. Create a new app on the Robinhood chain
4. Copy your API key
5. Use this URL format:
   ```
   https://api.alchemy.com/nft/v3/{API_KEY}/getNFTsForCollection
   ```

#### Option B: Reservoir

1. Go to https://reservoir.tools/
2. Get your API key
3. Use this URL format:
   ```
   https://api.reservoir.tools/tokens/v6
   ```

#### Option C: Goldsky

Custom GraphQL endpoint - requires setup with your query parameters.

## Architecture Changes

### What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **Data Source** | Fallback to contract if indexer unavailable | Indexer only (required) |
| **Token Discovery** | Called `tokenURI()` for each token ID | Fetches from indexer only |
| **Performance** | Scanned all token IDs sequentially | Paginated results from indexer |
| **Minted NFTs** | Assumed all token IDs exist | Only displays actual minted NFTs |
| **Metadata** | Fetched from contract URIs | Fetched from indexer metadata |

### Smart Contract Usage

The contract is now used **only** for live collection state:

- `totalSupply()` - Total minted NFTs
- `maxSupply()` - Maximum supply cap
- `mintPrice()` - Current mint price
- `salePhase()` - Sale status (public/closed)
- `revealed()` - Whether metadata is revealed

## Features

### ✅ Search

Search by:
- Token ID (e.g., "#001", "001")
- NFT Name (e.g., "HOODIE #042")

### ✅ Filters

Filter by:
- **All** - Show all NFTs
- **Common** - Green rarity
- **Rare** - Amber rarity
- **Legendary** - Primary color rarity

### ✅ Sorting

Sort by:
- **Newest** - Most recently minted
- **Oldest** - First minted
- **ID ↑** - Token ID ascending
- **ID ↓** - Token ID descending

### ✅ Pagination

- Infinite scroll loads more NFTs automatically
- 24 NFTs per page by default
- No full-collection load required

### ✅ Empty States

- **No NFTs Minted**: Shows elegant empty state with CTA
- **No Search Results**: User-friendly "no matches" message
- **No Filter Results**: Clear feedback about filters

### ✅ Reveal Support

- Before reveal: Displays hidden artwork from contract
- After reveal: Automatically displays real metadata
- **No UI changes needed** - automatic metadata update

### ✅ Wallet Support

- Shows NFTs owned by connected wallet
- Uses indexer to fetch wallet NFTs
- Does NOT iterate through all token IDs

### ✅ IPFS Support

- Automatically converts IPFS URIs to HTTP gateway URLs
- Uses `NEXT_PUBLIC_IPFS_GATEWAY` environment variable
- Supports multiple gateway formats

## Collection Statistics Display

The stats panel shows real-time contract state:

```
SUPPLY:  18 / 2222      (Minted / Max Supply)
MINT:    0.01 ETH       (From mintPrice())
REVEAL:  LIVE           (From revealed())
SALE:    PUBLIC         (From salePhase())
```

## Performance Optimizations

- **Memoization**: `useMemo` prevents unnecessary re-renders
- **Pagination**: Loads 24 NFTs at a time, not all
- **Caching**: TanStack Query caches results (60s stale time)
- **Refetch Intervals**: Smart contract state updates every 25 seconds
- **Intersection Observer**: Auto-loads next page on scroll

## Troubleshooting

### Error: "Configure NEXT_PUBLIC_NFT_INDEXER_URL to use the NFT indexer"

**Solution**: Add the environment variable to `.env.local` and restart the dev server.

### Collection page shows "No NFTs Minted Yet"

**Possible causes**:
1. Indexer API returned no NFTs (no mints yet)
2. Indexer is unavailable (check API status)
3. Contract address mismatch

**Debugging**:
```bash
# Check indexer API in browser:
https://api.alchemy.com/nft/v3/{API_KEY}/getNFTsForCollection?contractAddress={CONTRACT}&limit=1
```

### Search not finding NFTs

**Check that**:
- Search query matches token ID or name
- Filters aren't hiding the NFT
- NFT metadata includes name field

### Reveal not working after contract update

**Note**: Metadata updates happen when indexer re-crawls the contract.
- Alchemy refreshes metadata every ~30 minutes
- Manual refresh available in Alchemy dashboard
- Check indexer docs for refresh options

## API Integration

The page expects the indexer API to follow this pattern:

```javascript
// Request
GET /api?contractAddress={addr}&limit=24&cursor={pageKey}

// Response
{
  "nfts": [
    {
      "tokenId": 1,
      "name": "HOODIE #001",
      "description": "...",
      "image": "ipfs://...",
      "attributes": [
        { "trait_type": "Rarity", "value": "common" }
      ],
      "owner": "0x...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pageKey": "next_cursor" // or nextPageKey, continuation, nextCursor
}
```

## Files Modified

- `src/app/collection/page.tsx` - Main collection page
- Imports removed: `usePublicClient`, `fetchContractNftPage`, `hasNftIndexer`
- Imports added: `Search` icon from lucide-react

## Files Unchanged

- `src/lib/nft-indexer.ts` - Indexer client (no changes needed)
- `src/lib/contract-nfts.ts` - Contract fallback (no longer used)
- `src/lib/ipfs.ts` - IPFS gateway (already implemented)
- UI components - All styling preserved
- `src/components/ui/toast-provider` - Error handling

## Next Steps

1. **Get API Key**: Set up Alchemy or Reservoir account
2. **Update `.env.local`**: Add `NEXT_PUBLIC_NFT_INDEXER_URL`
3. **Restart Dev Server**: `npm run dev`
4. **Test Features**: Search, filter, sort, pagination
5. **Monitor Refresh**: Ensure indexer updates as NFTs are minted

## Questions?

Refer to:
- [Alchemy NFT API Docs](https://docs.alchemy.com/reference/nft-api-quickstart)
- [Reservoir API Docs](https://docs.reservoir.tools/)
- [Code in `src/lib/nft-indexer.ts`](../src/lib/nft-indexer.ts)
