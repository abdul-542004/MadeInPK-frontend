# Seller Dashboard Refactor - Backend Integration

**Date:** November 14, 2025

## Overview

Refactored the seller dashboard to properly reflect the backend database structure and API endpoints. The previous implementation had misaligned types and didn't match the Product/Listing separation model used in the backend.

---

## Key Changes

### 1. **New Type Definitions** (`src/types/seller.ts`)

Created comprehensive type definitions that match the backend structure:

#### Order Types
- `OrderStatus`: Proper backend status values (`pending_payment`, `payment_failed`, `paid`, `shipped`, `delivered`, `cancelled`)
- `OrderType`: `fixed_price`, `auction`, `cart`
- `SellerOrder`: Complete order structure with all backend fields
- `ShippingAddressDetail`: Full address information

#### Product Types
- `SellerProductListing`: Combined view of Product + FixedPriceListing/AuctionListing
  - Separates product core data from listing-specific data
  - Supports both auction and fixed-price listings
  - Includes discount information for fixed-price listings

#### Statistics
- `SellerStatistics`: Backend statistics structure
- `SellerEarnings`: Earnings breakdown by period

---

### 2. **Updated Services** (`src/services/sellerService.ts`)

Added new service methods:

```typescript
// Orders
getSellerOrders(filters?) - GET /orders/?role=seller
markOrderShipped(orderId) - POST /orders/{id}/mark_shipped/

// Products & Listings
getSellerProducts(filters?) - GET /products/
getSellerListings(filters?) - GET /listings/
updateListing(listingId, data) - PATCH /listings/{id}/
deleteProduct(productId) - DELETE /products/{id}/
```

---

### 3. **Refactored SellerContext** (`src/contexts/SellerContext.tsx`)

**Major Changes:**

#### Data Structure
- Changed from mock `SellerProduct[]` to `SellerProductListing[]`
- Now properly separates Product (core) from Listing (price/stock)
- Products are loaded by combining `/products/` and `/listings/` responses

#### Product Management
```typescript
// Creating a product now follows 2-step process:
1. Create Product (POST /products/)
2. Create Fixed-Price Listing (POST /listings/)
```

#### Key Methods
- `loadProducts()`: Fetches and combines products with listings
- `loadOrders()`: Fetches seller orders from backend
- `loadStatistics()`: Gets real-time statistics
- `addProduct()`: Creates product + listing
- `updateProduct(productId, listingId, updates)`: Updates listing
- `deleteProduct(productId)`: Deletes product
- `markOrderShipped(orderId)`: Ships order

---

### 4. **Updated UI Components**

#### SellerDashboardHome.tsx
- Uses backend `OrderStatus` type
- Displays proper order fields: `order_number`, `product_name`, `buyer_username`
- Shows earnings from `seller_amount` (not `total_amount`)
- Formats dates using ISO timestamps
- Status badges use backend status values

#### SellerProducts.tsx
- Displays `SellerProductListing` instead of old `SellerProduct`
- Shows product images from `images[0].image_url`
- Displays quantity (not "stock")
- Category shows `categoryName`
- Edit function requires both `productId` and `listingId`

#### SellerAddProduct.tsx
- Simplified to use new `addProduct()` signature
- Removed material/origin fields (not in backend model)
- Condition defaults to 'new'

#### SellerAuctions.tsx
- Already aligned with backend auction structure

---

## Backend Model Alignment

### Product Structure

```
User (Seller)
 └── Product (core entity)
      ├── Images[]
      ├── Category
      ├── Description, Condition
      └── Listings:
           ├── FixedPriceListing
           │    ├── price, quantity, status
           │    └── discount fields
           └── AuctionListing
                ├── starting_price, current_price
                ├── start_time, end_time
                └── Bids[]
```

### Order Structure

```
Order
 ├── buyer, seller
 ├── product (reference)
 ├── order_type (fixed_price | auction | cart)
 ├── quantity, unit_price, total_amount
 ├── platform_fee (2%), seller_amount
 ├── shipping_address_detail
 ├── status (OrderStatus)
 └── timestamps (created_at, paid_at, shipped_at, delivered_at)
```

---

## Migration Notes

### Breaking Changes

1. **Product ID Type**: Changed from `string` to `number`
2. **Order Status Values**: Now uses snake_case backend values
3. **Product Properties**: 
   - `image` → `images[0].image_url`
   - `stock` → `quantity`
   - `category` → `categoryName`
   - `price` is now string (from backend)
4. **Order Properties**:
   - `id` (string) → `id` (number)
   - `customer` → `buyer_username`
   - `productName` → `product_name`
   - `date` → `created_at`
   - `total` → `total_amount`

### Backward Compatibility

- Mock mode still supported for development
- Context provides default empty statistics
- Error handling preserves user experience

---

## Testing Checklist

- [ ] Products load correctly from backend
- [ ] Orders display with proper formatting
- [ ] Statistics show accurate data
- [ ] Add product creates both product and listing
- [ ] Edit product updates listing price/quantity
- [ ] Delete product removes from backend
- [ ] Mark order as shipped works
- [ ] Order details dialog shows all fields
- [ ] Product images display correctly
- [ ] Status badges show correct colors

---

## Future Enhancements

1. **Auction Management**: Extend seller dashboard to manage auctions
2. **Discount Management**: UI for setting time-limited discounts
3. **Sales Analytics**: Charts and graphs for earnings over time
4. **Inventory Alerts**: Notifications for low stock
5. **Bulk Operations**: Multi-select for batch updates
6. **Product Images Upload**: Handle actual file uploads (currently URLs only)

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/products/` | GET | List seller's products |
| `/products/` | POST | Create new product |
| `/products/{id}/` | DELETE | Delete product |
| `/listings/` | GET | List fixed-price listings |
| `/listings/` | POST | Create listing for product |
| `/listings/{id}/` | PATCH | Update listing |
| `/orders/?role=seller` | GET | Get seller's orders |
| `/orders/{id}/mark_shipped/` | POST | Mark order as shipped |
| `/seller/statistics/` | GET | Get seller statistics |

---

## Files Modified

1. `src/types/seller.ts` - **NEW**
2. `src/services/sellerService.ts` - **UPDATED**
3. `src/contexts/SellerContext.tsx` - **REFACTORED**
4. `src/components/seller/SellerDashboardHome.tsx` - **UPDATED**
5. `src/components/seller/SellerProducts.tsx` - **UPDATED**
6. `src/components/seller/SellerAddProduct.tsx` - **UPDATED**

---

## Conclusion

The seller dashboard now accurately reflects the backend's Product/Listing separation model. This provides:

- ✅ Type safety with proper TypeScript interfaces
- ✅ Correct data flow between frontend and backend
- ✅ Support for both fixed-price and auction listings
- ✅ Proper order management with all status transitions
- ✅ Real-time statistics from backend
- ✅ Scalable architecture for future features
