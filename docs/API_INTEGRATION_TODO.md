# API Integration Mapping - Components & Backend Endpoints

**Generated:** October 30, 2025  
**Status:** Components requiring API integration identified

---

## ✅ Already Integrated

### 1. Authentication (DONE)
- **AuthDialog.tsx** ✅
- **AuthContext.tsx** ✅  
- **authService.ts** ✅
- **Backend Endpoints:**
  - `POST /api/auth/register/`
  - `POST /api/auth/login/`
  - `POST /api/auth/logout/`
  - `GET /api/auth/profile/`

### 2. Products & Listings (PARTIAL)
- **productService.ts** ✅ - Service layer ready
- **ProductsPage.tsx** ✅ - Already using backend
- **ProductDetailPage.tsx** ✅ - Already using backend  
- **FeaturedProducts.tsx** ✅ - Already using backend
- **Backend Endpoints:**
  - `GET /api/categories/`
  - `GET /api/products/`
  - `GET /api/auctions/`
  - `GET /api/listings/`

---

## 🔴 Needs API Integration

### 1. **Cart & Checkout System** 🛒

#### Components Needing Integration:
- **CartPage.tsx** - Uses mock data
- **CartContext.tsx** - Local storage only  
- **CheckoutPage.tsx** - No backend integration
- **OrderSuccessPage.tsx** - Static page

#### Backend APIs Available:
```typescript
// Orders API
POST /api/orders/                     // Create order
GET /api/orders/                      // List orders
GET /api/orders/{id}/                 // Order details
POST /api/orders/{id}/mark_shipped/  // Mark shipped
POST /api/orders/{id}/mark_delivered/ // Mark delivered

// Fixed Price Listings
POST /api/listings/{id}/purchase/    // Purchase listing
```

#### Required Service File:
**Create:** `src/services/orderService.ts`

```typescript
export const orderService = {
  createOrder: (data) => POST /api/orders/,
  getOrders: (filters) => GET /api/orders/,
  getOrderDetails: (id) => GET /api/orders/{id}/,
  markShipped: (id) => POST /api/orders/{id}/mark_shipped/,
  markDelivered: (id) => POST /api/orders/{id}/mark_delivered/,
  purchaseListing: (id, data) => POST /api/listings/{id}/purchase/,
}
```

#### Implementation Priority: **HIGH** 🔥

---

### 2. **Address Management** 📍

#### Components Needing Integration:
- **AddressPanel.tsx** - Uses mock AddressContext
- **AddressContext.tsx** - Local state only
- **CheckoutPage.tsx** - Address selection

#### Backend APIs Available:
```typescript
// Location APIs
GET /api/provinces/              // List provinces
GET /api/cities/                 // List cities
GET /api/cities/?province={id}   // Cities by province

// Address Management
GET /api/addresses/              // User addresses
POST /api/addresses/             // Create address
PUT /api/addresses/{id}/         // Update address
DELETE /api/addresses/{id}/      // Delete address
PATCH /api/addresses/{id}/set_default/ // Set default
```

#### Required Service File:
**Create:** `src/services/addressService.ts`

```typescript
export const addressService = {
  getProvinces: () => GET /api/provinces/,
  getCities: (provinceId?) => GET /api/cities/,
  getAddresses: () => GET /api/addresses/,
  createAddress: (data) => POST /api/addresses/,
  updateAddress: (id, data) => PUT /api/addresses/{id}/,
  deleteAddress: (id) => DELETE /api/addresses/{id}/,
  setDefaultAddress: (id) => PATCH /api/addresses/{id}/set_default/,
}
```

#### Implementation Priority: **HIGH** 🔥

---

### 3. **Wishlist System** ❤️

#### Components Needing Integration:
- **WishlistPage.tsx** - Uses WishlistContext
- **WishlistContext.tsx** - Local storage only
- **ProductCard.tsx** - Wishlist toggle

#### Backend APIs Available:
```typescript
// Wishlist APIs
GET /api/wishlist/           // Get wishlist
POST /api/wishlist/          // Add to wishlist
DELETE /api/wishlist/{id}/   // Remove from wishlist
```

#### Required Service File:
**Create:** `src/services/wishlistService.ts`

```typescript
export const wishlistService = {
  getWishlist: () => GET /api/wishlist/,
  addToWishlist: (productId) => POST /api/wishlist/,
  removeFromWishlist: (id) => DELETE /api/wishlist/{id}/,
}
```

#### Implementation Priority: **MEDIUM** 🟡

---

### 4. **Auction System** ⏰

#### Components Needing Integration:
- **AuctionPage.tsx** - Needs auction listing
- **AuctionDetailPage.tsx** - Needs bid placement
- **AuctionContext.tsx** - Mock data

#### Backend APIs Available:
```typescript
// Auction APIs
GET /api/auctions/                    // List auctions
GET /api/auctions/{id}/               // Auction details
POST /api/auctions/{id}/place_bid/    // Place bid
GET /api/auctions/{id}/bids/          // Get bids

// WebSocket (real-time)
ws://localhost:8000/ws/auction/{id}/  // Live bidding
```

#### Required Updates:
- **AuctionContext.tsx** - Connect to backend
- **WebSocket Integration** - Real-time bids

#### Implementation Priority: **MEDIUM** 🟡

---

### 5. **Seller Dashboard** 🏪

#### Components Needing Integration:
- **SellerDashboard.tsx** - All seller pages
- **SellerProducts.tsx** - Product management
- **SellerOrders.tsx** - Order management
- **SellerAddProduct.tsx** - Product creation
- **SellerAuctions.tsx** - Auction management
- **SellerSettings.tsx** - Profile settings

#### Backend APIs Available:
```typescript
// Seller Products
POST /api/products/                          // Create product
POST /api/products/{id}/add_image/           // Upload image
PUT /api/products/{id}/                      // Update product
DELETE /api/products/{id}/                   // Delete product

// Seller Listings
POST /api/listings/                          // Create listing
PUT /api/listings/{id}/                      // Update listing
DELETE /api/listings/{id}/                   // Delete listing

// Seller Auctions
POST /api/auctions/                          // Create auction
PUT /api/auctions/{id}/                      // Update auction
DELETE /api/auctions/{id}/                   // Delete auction

// Seller Orders
GET /api/orders/?role=seller                 // Seller orders
POST /api/orders/{id}/mark_shipped/          // Mark shipped

// Seller Profile
GET /api/seller-profiles/                    // List sellers
GET /api/seller-profiles/{id}/               // Profile details
PUT /api/seller-profiles/{id}/               // Update profile
```

#### Required Service File:
**Update:** `src/services/sellerService.ts` (already exists, needs completion)

#### Implementation Priority: **HIGH** 🔥

---

### 6. **Notifications System** 🔔

#### Components Needing Integration:
- **NotificationPanel.tsx** - Notification display
- **NotificationContext.tsx** - Uses mock data
- **NotificationConnector.tsx** - WebSocket stub

#### Backend APIs Available:
```typescript
// Notifications
GET /api/notifications/                      // List notifications
PATCH /api/notifications/{id}/mark_read/     // Mark as read
PATCH /api/notifications/mark_all_read/      // Mark all read
DELETE /api/notifications/{id}/              // Delete notification
```

#### Required Service File:
**Create:** `src/services/notificationService.ts`

```typescript
export const notificationService = {
  getNotifications: () => GET /api/notifications/,
  markRead: (id) => PATCH /api/notifications/{id}/mark_read/,
  markAllRead: () => PATCH /api/notifications/mark_all_read/,
  deleteNotification: (id) => DELETE /api/notifications/{id}/,
}
```

#### Implementation Priority: **LOW** 🟢

---

### 7. **Messaging System** 💬

#### Components Needing Integration:
- **SellerMessages.tsx** - Message inbox

#### Backend APIs Available:
```typescript
// Messaging
GET /api/conversations/                      // List conversations
GET /api/conversations/{id}/                 // Conversation details
POST /api/conversations/                     // Start conversation
GET /api/conversations/{id}/messages/        // Get messages
POST /api/conversations/{id}/messages/       // Send message
```

#### Required Service File:
**Create:** `src/services/messageService.ts`

```typescript
export const messageService = {
  getConversations: () => GET /api/conversations/,
  getConversation: (id) => GET /api/conversations/{id}/,
  startConversation: (data) => POST /api/conversations/,
  getMessages: (id) => GET /api/conversations/{id}/messages/,
  sendMessage: (id, message) => POST /api/conversations/{id}/messages/,
}
```

#### Implementation Priority: **LOW** 🟢

---

### 8. **Reviews & Feedback** ⭐

#### Components Needing Integration:
- **OrderSuccessPage.tsx** - Leave review
- **ProductDetailPage.tsx** - Display reviews

#### Backend APIs Available:
```typescript
// Product Reviews
GET /api/product-reviews/                    // List reviews
POST /api/product-reviews/                   // Create review
PUT /api/product-reviews/{id}/               // Update review
DELETE /api/product-reviews/{id}/            // Delete review

// Order Feedback
GET /api/feedbacks/                          // List feedbacks
POST /api/feedbacks/                         // Create feedback
GET /api/feedbacks/?order={id}               // Order feedback
```

#### Required Service File:
**Create:** `src/services/reviewService.ts`

```typescript
export const reviewService = {
  getProductReviews: (productId) => GET /api/product-reviews/,
  createReview: (data) => POST /api/product-reviews/,
  updateReview: (id, data) => PUT /api/product-reviews/{id}/,
  deleteReview: (id) => DELETE /api/product-reviews/{id}/,
  
  getOrderFeedback: (orderId) => GET /api/feedbacks/,
  createFeedback: (data) => POST /api/feedbacks/,
}
```

#### Implementation Priority: **MEDIUM** 🟡

---

### 9. **Search & Filters** 🔍

#### Components Needing Integration:
- **SearchDialog.tsx** - Uses mockProducts
- **ProductFilters.tsx** - Categories from mock
- **ChatBot.tsx** - Product search

#### Backend APIs Available:
```typescript
// Search
GET /api/products/?search={query}            // Product search
GET /api/listings/?search={query}            // Listing search
GET /api/auctions/?search={query}            // Auction search

// Categories
GET /api/categories/                         // All categories
```

#### Required Changes:
- Update SearchDialog to use productService
- Update ProductFilters to fetch real categories
- Update ChatBot to use backend search

#### Implementation Priority: **MEDIUM** 🟡

---

### 10. **Admin Dashboard** 👑

#### Components Needing Integration:
- **AdminDashboard.tsx** - All admin pages
- **AdminUserManagement.tsx**
- **AdminProductOversight.tsx**
- **AdminTransactions.tsx**
- **AdminSellerManagement.tsx**

#### Backend APIs Available:
Note: Admin APIs are not documented in your backend docs. You may need to create these endpoints or use Django admin panel.

#### Implementation Priority: **LOW** 🟢 (Can use Django admin for now)

---

## 📊 Priority Summary

### 🔥 **HIGH PRIORITY** (Core E-commerce)
1. **Cart & Checkout** - orderService.ts
2. **Address Management** - addressService.ts  
3. **Seller Dashboard** - Complete sellerService.ts

### 🟡 **MEDIUM PRIORITY** (Enhanced Features)
4. **Wishlist** - wishlistService.ts
5. **Auction System** - Update AuctionContext
6. **Reviews & Feedback** - reviewService.ts
7. **Search & Filters** - Update existing components

### 🟢 **LOW PRIORITY** (Nice to Have)
8. **Notifications** - notificationService.ts
9. **Messaging** - messageService.ts
10. **Admin Dashboard** - Use Django admin

---

## 🚀 Implementation Roadmap

### Phase 1: Core Commerce (Week 1)
```bash
✅ Authentication (DONE)
✅ Product Listing (DONE)
🔴 Create orderService.ts
🔴 Integrate CheckoutPage with orders API
🔴 Create addressService.ts
🔴 Integrate AddressPanel with backend
```

### Phase 2: Seller Features (Week 2)
```bash
🔴 Complete sellerService.ts
🔴 Integrate SellerAddProduct
🔴 Integrate SellerProducts
🔴 Integrate SellerOrders
🔴 Add image upload functionality
```

### Phase 3: Enhanced Features (Week 3)
```bash
🔴 Create wishlistService.ts
🔴 Integrate WishlistContext
🔴 Update AuctionContext with backend
🔴 WebSocket integration for live bidding
🔴 Create reviewService.ts
```

### Phase 4: Polish & Extras (Week 4)
```bash
🔴 Create notificationService.ts
🔴 Create messageService.ts
🔴 Update SearchDialog
🔴 Update ChatBot with backend search
🔴 Admin features (if needed)
```

---

## 📝 Service Files to Create

1. ✅ `authService.ts` - **DONE**
2. ✅ `productService.ts` - **DONE**
3. 🔴 `orderService.ts` - **TODO**
4. 🔴 `addressService.ts` - **TODO**
5. 🔴 `wishlistService.ts` - **TODO**
6. 🔴 `reviewService.ts` - **TODO**
7. 🔴 `notificationService.ts` - **TODO**
8. 🔴 `messageService.ts` - **TODO**
9. 🟡 `sellerService.ts` - **PARTIAL** (needs completion)

---

## 💡 Quick Start - Next Steps

### 1. Cart & Orders (Most Critical)

**Create `src/services/orderService.ts`:**
```typescript
import apiClient from '../lib/apiClient';

export const orderService = {
  // Create order from listing
  purchaseListing: async (listingId: number, data: {
    quantity: number;
    shipping_address: number;
  }) => {
    const response = await apiClient.post(
      `/listings/${listingId}/purchase/`,
      data
    );
    return response.data;
  },

  // Get user orders
  getOrders: async (filters?: { role?: 'buyer' | 'seller'; status?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await apiClient.get(`/orders/?${params.toString()}`);
    return response.data;
  },

  // Get order details
  getOrderDetails: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}/`);
    return response.data;
  },

  // Mark order as shipped (seller)
  markShipped: async (id: number, trackingNumber?: string) => {
    const response = await apiClient.post(`/orders/${id}/mark_shipped/`, {
      tracking_number: trackingNumber
    });
    return response.data;
  },

  // Mark order as delivered (seller)
  markDelivered: async (id: number) => {
    const response = await apiClient.post(`/orders/${id}/mark_delivered/`);
    return response.data;
  },
};
```

### 2. Address Management

**Create `src/services/addressService.ts`:**
```typescript
import apiClient from '../lib/apiClient';

export const addressService = {
  // Get provinces
  getProvinces: async () => {
    const response = await apiClient.get('/provinces/');
    return response.data.results;
  },

  // Get cities by province
  getCities: async (provinceId?: number) => {
    const params = provinceId ? `?province=${provinceId}` : '';
    const response = await apiClient.get(`/cities/${params}`);
    return response.data.results;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await apiClient.get('/addresses/');
    return response.data.results;
  },

  // Create address
  createAddress: async (data: {
    street_address: string;
    city: number;
    postal_code: string;
    is_default?: boolean;
  }) => {
    const response = await apiClient.post('/addresses/', data);
    return response.data;
  },

  // Update address
  updateAddress: async (id: number, data: any) => {
    const response = await apiClient.put(`/addresses/${id}/`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: number) => {
    await apiClient.delete(`/addresses/${id}/`);
  },

  // Set default address
  setDefaultAddress: async (id: number) => {
    const response = await apiClient.patch(`/addresses/${id}/set_default/`);
    return response.data;
  },
};
```

---

## ✅ Testing Checklist

For each new service integration:
- [ ] Service file created
- [ ] Types defined
- [ ] Context updated (if applicable)
- [ ] Component updated to use service
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/error toasts
- [ ] Tested with backend running

---

**Next Action:** Start with orderService.ts and addressService.ts for checkout flow! 🚀
