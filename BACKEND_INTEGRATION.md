# Backend Integration Guide

## Overview
This document tracks the integration of the MadeInPK frontend with the Django backend API.

## Completed Features

### ✅ Authentication System (Login/Signup)

#### Files Created/Modified:
1. **`src/types/auth.ts`** - TypeScript interfaces for authentication
   - User, SellerProfile, LoginRequest/Response, RegisterRequest/Response types
   - UserRole type: 'buyer' | 'seller' | 'both' | 'admin'

2. **`src/lib/apiClient.ts`** - Axios configuration
   - Base URL: `http://localhost:8000/api` (configurable via `VITE_API_BASE_URL`)
   - Request interceptor: Adds `Authorization: Token <token>` header
   - Response interceptor: Handles 401 (token expired) and 403 (account blocked)

3. **`src/services/authService.ts`** - Authentication API calls
   - `login(credentials)` - POST `/api/auth/login/`
   - `register(userData)` - POST `/api/auth/register/`
   - `logout()` - POST `/api/auth/logout/`
   - `getProfile()` - GET `/api/auth/profile/`

4. **`src/contexts/AuthContext.tsx`** - Updated with real API integration
   - Async login/signup functions
   - Token persistence in localStorage
   - Auto-verification of token on app load
   - Proper error handling with backend error messages
   - Role-based access: `isAdmin`, `isSeller`, `isBuyer`

5. **`src/components/AuthDialog.tsx`** - Enhanced UI
   - Loading states during API calls
   - Backend validation error display
   - All required fields per backend API:
     - Username (required)
     - Email (required)
     - Password & Confirm Password (required, min 8 chars)
     - First Name & Last Name (optional)
     - Phone Number (optional, format: +923001234567)
     - Role selection (buyer/seller/both)

#### Features:
- ✅ Token-based authentication
- ✅ Persistent login (localStorage)
- ✅ Auto token validation on app load
- ✅ Proper error handling (401, 403, validation errors)
- ✅ Loading indicators
- ✅ Role-based access control
- ✅ Account type selection during signup

#### Backend Endpoints Used:
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Testing

### Test Users (from backend docs):
All passwords: `password123`

| Username | Email | Role | Description |
|----------|-------|------|-------------|
| buyer1 | buyer1@example.com | buyer | Regular buyer |
| seller1 | seller1@example.com | seller | Verified seller (Hassan Textiles) |
| seller4 | seller4@example.com | both | Can buy and sell |

### Testing Steps:
1. Start the Django backend: `python manage.py runserver`
2. Start the frontend: `npm run dev`
3. Test login with existing users
4. Test registration with new user data
5. Verify token persistence (refresh page)
6. Test logout functionality

### ✅ Products & Auctions Display

#### Files Created/Modified:
1. **`src/types/product.ts`** - Product and auction types
   - Product, Auction, FixedPriceListing interfaces
   - ProductImage, SellerProfileSummary, Bid types
   - Filter interfaces for API queries

2. **`src/services/productService.ts`** - Product API service
   - `getProducts()` - Fetch products with filters
   - `getAuctions()` - Fetch auctions with filters
   - `getFeaturedProducts()` - Get newest products for homepage
   - `getNewAuctions()` - Get active auctions for homepage

3. **`src/components/FeaturedProducts.tsx`** - Refactored with real data
   - Fetches products from backend
   - Displays product images, ratings, seller info
   - Loading and empty states
   - Click to view product details

4. **`src/components/NewAuctions.tsx`** - New component
   - Displays active auctions
   - Shows current bid, time remaining, total bids
   - Verified seller badges
   - Click to view auction details

5. **`src/components/HomePage.tsx`** - Updated
   - Added NewAuctions component
   - Dynamic content from backend

#### Features:
- ✅ Display real products from backend
- ✅ Display active auctions
- ✅ Product images with fallback
- ✅ Seller information and verification badges
- ✅ Product ratings and reviews count
- ✅ Auction countdown timers
- ✅ Current bid display
- ✅ Loading states
- ✅ Error handling

#### Backend Endpoints Used:
- `GET /api/products/` - List products
- `GET /api/auctions/` - List auctions

## Next Steps

### Pending Integrations:
- [ ] Product Detail Page
- [ ] Auction Detail Page & Bidding
- [ ] Fixed Price Listings & Pricing
- [ ] Orders & Payments (Stripe)
- [ ] Wishlist
- [ ] Cart functionality
- [ ] Messaging system
- [ ] Notifications (WebSocket)
- [ ] Seller Profile Pages
- [ ] Feedback & Reviews
- [ ] Complaints
- [ ] Admin features

### Priority Order:
1. **Fixed Price Listings** - Get actual prices for products
2. **Product Detail Pages** - Full product information
3. **Auction Bidding** - Real-time bidding with WebSocket
4. **Cart & Checkout** - Shopping cart and order placement
5. **Payments** - Stripe integration
6. **Seller Profiles** - Create/update seller profiles
7. **Messaging** - Buyer-seller communication
8. **Notifications** - Real-time notifications

## Notes

- The frontend was built with Figma Make, so some assets use `figma:asset/` imports
- All dummy/static data needs to be replaced with API calls
- WebSocket connections needed for real-time features (auctions, notifications, messaging)
- Stripe Connect integration required for payment processing

## API Documentation

Full API documentation available in:
- `backend_docs/AUTHENTICATION_API.md`
- `backend_docs/PRODUCTS_AND_LISTINGS_API.md`
- `backend_docs/ORDERS_AND_PAYMENTS_API.md`
- `backend_docs/ADDITIONAL_FEATURES_API.md`
- `backend_docs/WEBSOCKET_DOCUMENTATION.md`
