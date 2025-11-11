# Mock Mode Configuration Guide

## 🎯 Current Status: MOCK MODE ENABLED

The frontend is now configured to work **without a backend** using mock data.

---

## 🔧 Configuration File

**Location:** `src/lib/mockMode.ts`

```typescript
export const MOCK_MODE = true; // Set to false when backend is available
```

### To Switch Between Mock and Backend:

1. **Using Mock Data (No Backend Required):**
   ```typescript
   export const MOCK_MODE = true;
   ```

2. **Using Real Backend API:**
   ```typescript
   export const MOCK_MODE = false;
   ```
   - Backend must be running at `http://localhost:8000/api/`

---

## ✅ Features Working in Mock Mode

### 1. **Authentication** 🔐
- **Login:** Any email/password will work
- **Auto-creates demo user:** "Demo User" with email you enter
- **Persists in localStorage:** Stays logged in on page refresh
- **No registration needed:** Just use login

**Test It:**
- Click "Login" button
- Enter any email (e.g., `test@example.com`)
- Enter any password
- ✅ You'll be logged in as "Demo User"

---

### 2. **Search** 🔍
- Searches through **mock product data**
- Contains ~50+ Pakistani products (textiles, pottery, jewelry, etc.)
- Debounced search (300ms delay)
- Shows loading spinner

**Test It:**
- Click search icon (magnifying glass)
- Type: "carpet", "jewelry", "textile", "pottery"
- ✅ See results from mock data

---

### 3. **Wishlist** ❤️
- Add/remove products from wishlist
- Persists in **localStorage** (survives page refresh)
- Works without login in mock mode
- Displays on wishlist page

**Test It:**
- Browse products on home page
- Click heart icon on any product
- ✅ Toast: "Added to wishlist"
- Click heart again to remove
- ✅ Toast: "Removed from wishlist"
- Navigate to `/wishlist` to see saved items

---

### 4. **Product Listings** 🛍️
- Displays 50+ mock products
- Categories: Textiles, Pottery, Jewelry, Metalwork, etc.
- Product details: name, price, image, artisan, region
- Featured products section
- New products section

**Test It:**
- Navigate to `/products` or home page
- ✅ See grid of Pakistani artisan products
- Click any product to see details (if ProductDetailPage is configured)

---

## 📦 Mock Data Location

**File:** `src/data/mockProducts.ts`

Contains:
- 50+ Pakistani artisan products
- Categories: Textiles, Pottery, Jewelry, Metalwork, Woodwork, etc.
- Real images from Unsplash
- Prices in PKR
- Artisan names and regions
- Ratings and reviews

---

## 🔄 How Mock Mode Works

### Search Component (`SearchDialog.tsx`)
```typescript
if (MOCK_MODE) {
  // Filter mockProducts array locally
  const results = mockProducts.filter(product => 
    product.name.includes(query) || 
    product.category.includes(query)
  );
} else {
  // Call backend API
  const response = await productService.getFixedPriceListings({search: query});
}
```

### Wishlist Context (`WishlistContext.tsx`)
```typescript
if (MOCK_MODE) {
  // Save to localStorage
  localStorage.setItem('mockWishlist', JSON.stringify(items));
} else {
  // Call backend API
  await wishlistService.addToWishlist(productId);
}
```

### Auth Context (`AuthContext.tsx`)
```typescript
if (MOCK_MODE) {
  // Create mock user from email
  const mockUser = { username: email.split('@')[0], ... };
  localStorage.setItem('user', JSON.stringify(mockUser));
} else {
  // Call backend login API
  const response = await authService.login({email, password});
}
```

---

## 🧪 Testing Without Backend

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Authentication
- Click "Login"
- Email: `demo@test.com`
- Password: `anything`
- ✅ You should be logged in

### 3. Test Search
- Click search icon
- Type: `carpet`
- ✅ See ~5-10 carpet products

### 4. Test Wishlist
- Heart icon on any product
- ✅ Added to wishlist
- Check `/wishlist` page
- ✅ See your saved items

### 5. Test Persistence
- Add items to wishlist
- Refresh page (F5)
- ✅ Wishlist items still there
- ✅ Still logged in

---

## 📊 Mock Data Storage

All mock data is stored in **browser localStorage**:

### Check in Browser Console:
```javascript
// View mock wishlist
console.log(JSON.parse(localStorage.getItem('mockWishlist')));

// View mock user
console.log(JSON.parse(localStorage.getItem('user')));

// View auth token
console.log(localStorage.getItem('authToken'));
```

### Clear Mock Data:
```javascript
// Clear everything
localStorage.clear();

// Or clear specific items
localStorage.removeItem('mockWishlist');
localStorage.removeItem('user');
localStorage.removeItem('authToken');
```

---

## 🚀 Switching to Real Backend

When your backend is ready:

### 1. Update Mock Mode
**File:** `src/lib/mockMode.ts`
```typescript
export const MOCK_MODE = false; // Disable mock mode
```

### 2. Start Backend
```bash
# In backend folder
python manage.py runserver
```

### 3. Clear Mock Data
```javascript
// In browser console
localStorage.clear();
```

### 4. Test with Real API
- Login with real credentials
- Backend should respond at `http://localhost:8000/api/`
- Check Network tab for API calls

---

## ⚠️ Limitations of Mock Mode

### What Works:
✅ Search products
✅ Add/remove wishlist
✅ Login (any credentials)
✅ View product listings
✅ UI interactions
✅ Data persists on refresh

### What Doesn't Work:
❌ Real user accounts
❌ Real product data from database
❌ Cart checkout (not yet implemented)
❌ Seller dashboard data
❌ Auction bidding (WebSocket needed)
❌ Real payments
❌ User registration (just use login)
❌ Profile updates
❌ Reviews (service created, UI not integrated)

---

## 🎯 Next Steps

1. **Keep developing UI** - Mock mode works for UI development
2. **Test all features** - Search, wishlist, navigation
3. **Set up backend later** - When ready, just switch `MOCK_MODE = false`
4. **Continue with medium priority features** - Auction integration (will need backend)

---

## 💡 Tips

- **Mock mode is perfect for:** UI development, styling, layouts, user flows
- **Need backend for:** Real data, authentication, payments, WebSocket (auctions)
- **Easy to switch:** Change one line in `mockMode.ts`
- **No data loss:** Mock wishlist saved in localStorage

---

## 🐛 Troubleshooting

### Issue: "Added to wishlist" but not appearing?
**Solution:** Check `/wishlist` page, might be scroll issue on home page

### Issue: Login not working?
**Solution:** Just enter any email/password in mock mode, will auto-accept

### Issue: Search shows no results?
**Solution:** Try keywords: "carpet", "jewelry", "textile", "pottery", "blue"

### Issue: Wishlist disappears after refresh?
**Solution:** Check browser console for errors, localStorage might be disabled

---

**Current Mode: MOCK MODE ✅**  
**Backend Required: NO ❌**  
**Can Develop UI: YES ✅**
