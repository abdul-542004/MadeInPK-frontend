# AuctionContext Backend Integration Plan

## Summary
The AuctionContext needs to be updated to integrate with the backend API and WebSocket for real-time auction bidding. However, several components depend on methods that need to be preserved or updated.

## Current Component Dependencies

### Components Using AuctionContext:
1. **AuctionDetailPage.tsx** - Uses: `useAuction()`, `getAuction()`, `placeBid()`
2. **AuctionPage.tsx** - Uses: `useAuction()`, `auctions`
3. **NotificationConnector.tsx** - Uses: `setNotificationHandler()`
4. **SellerAuctions.tsx** - Uses: `useAuction()`, `myAuctions`, `createAuction()`, `deleteAuction()`

## Required Changes

### 1. AuctionContext.tsx Updates
**Changes Needed:**
- ✅ Change from old `Bid`/`Auction` interfaces to types from `types/product.ts`
- ✅ Update `placeBid()` to async (returns `Promise<boolean>`)
- ✅ Add WebSocket support with `connectToAuction()` and `disconnectFromAuction()`
- ✅ Add `refreshAuctions()` method
- ✅ Load auctions from backend or mock localStorage
- ❌ Keep `createAuction()` - currently NOT in backend API (seller creates via product service)
- ❌ Keep `deleteAuction()` - currently NOT in backend API
- ❌ Keep `setNotificationHandler()` - for backward compatibility
- ❌ Remove `checkExpiredAuctions()` - backend handles this

**Backend API Endpoints Available:**
- `GET /api/products/auctions/` - List auctions with filters
- `POST /api/products/auctions/{id}/bid/` - Place bid
- WebSocket: `ws://localhost:8000/ws/auction/{id}/?token={token}` - Real-time updates

**Backend API NOT Available (Seller auction management):**
- Create auction - done via product creation with auction type
- Delete auction - done via product deletion
- Update auction - done via product update

### 2. Component Updates Required

#### AuctionDetailPage.tsx
**Changes:**
```typescript
// OLD:
const result = placeBid(auction.id, amount); // synchronous

// NEW:
const result = await placeBid(auction.id, amount); // async
```

**Actions:**
1. Make `handlePlaceBid` async
2. Update `auction.id` (already number type compatible)
3. Add WebSocket connection on mount: `connectToAuction(auctionId)`
4. Add WebSocket disconnection on unmount: `disconnectFromAuction(auctionId)`

#### AuctionPage.tsx
**Changes:**
- No changes needed (just displays auctions array)

#### SellerAuctions.tsx
**Major Refactor Needed:**
This component currently uses `createAuction()` and `deleteAuction()` which don't exist in the backend API. 

**Solution:**
1. Remove local `createAuction()` - redirect to product creation flow
2. Remove local `deleteAuction()` - use product deletion API
3. Load `myAuctions` from backend filtered by seller
4. Update interface to match new Auction type

#### NotificationConnector.tsx
**Changes:**
- Keep `setNotificationHandler()` export for now (deprecated but functional)
- Consider removing once auction notifications move to NotificationContext

## Implementation Steps

### Step 1: Create New Auction Context (Simplified)
Create a new AuctionContext with:
- Backend integration for loading and bidding
- WebSocket support
- Mock mode with localStorage
- Backward compatible methods (even if they just show toast errors)

### Step 2: Update AuctionDetailPage
- Make bid handler async
- Add WebSocket connection/disconnection

### Step 3: Update SellerAuctions  
- Remove create/delete auction UI
- Show message: "Create auctions via Products > Add Product > Auction Type"
- Load auctions from backend filtered by seller

### Step 4: Clean Up
- Remove `setNotificationHandler` once all transitions complete
- Add auction creation to Seller Product flow

## Backward Compatibility Strategy

To avoid breaking existing code immediately, the new AuctionContext will:
1. Keep `setNotificationHandler()` export (no-op or minimal implementation)
2. Add `createAuction()` stub that shows toast: "Please create auctions via Products page"
3. Add `deleteAuction()` stub that shows toast: "Please delete auctions via Products page"
4. All existing components will continue to work (with degraded functionality for seller actions)

## Next Steps

Would you like me to:
1. **Implement the new AuctionContext with backward compatibility** (recommended)
2. **Update all components simultaneously** (more work but cleaner)
3. **Create the context first, then update components one by one** (gradual migration)

Choose an approach and I'll proceed with the implementation.
