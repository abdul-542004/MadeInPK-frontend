# Backend API Integration Testing Guide

**Date:** October 30, 2025  
**Status:** Testing Wishlist, Search, and Reviews Integration

## 🔧 Prerequisites

Before testing, ensure:

1. **Backend Server Running**
   ```bash
   # Backend should be running at:
   http://localhost:8000/api/
   ```

2. **Frontend Dev Server Running**
   ```bash
   npm run dev
   # Should be running at http://localhost:3000
   ```

3. **User Authentication**
   - You need to be logged in to test most features
   - The auth token is automatically stored in localStorage
   - Check browser console for "Auth token stored" message after login

---

## ✅ 1. Testing Authentication (Already Integrated)

### Login Test
1. Open `http://localhost:3000`
2. Click the **"Login"** button in header
3. Enter credentials:
   - **Email:** your-email@example.com
   - **Password:** your-password
4. Click **"Sign In"**

**Expected Results:**
- ✅ Toast notification: "Login successful"
- ✅ User menu appears in header with your name
- ✅ Browser console shows: "Auth token stored: ..."
- ✅ "Login" button changes to user profile menu

**Check Backend Call:**
- Open **DevTools → Network Tab**
- Filter by "XHR" or "Fetch"
- Look for: `POST http://localhost:8000/api/auth/login/`
- **Status:** 200 OK
- **Response:** Should contain `token`, `user_id`, `username`, `email`

---

## ✅ 2. Testing Product Search (Just Integrated)

### Search Test
1. Click the **Search icon** (magnifying glass) in header
2. Type a search query (e.g., "carpet", "jewelry", "textile")
3. Wait ~300ms for debounced search to trigger

**Expected Results:**
- ✅ Loading spinner appears briefly
- ✅ Search results display from backend
- ✅ Each result shows:
  - Product image
  - Product name
  - Category name
  - Price in Rs.
- ✅ Result count shown (e.g., "5 results found")
- ✅ Click on any result navigates to product detail page

**Check Backend Call:**
- Open **DevTools → Network Tab**
- Look for: `GET http://localhost:8000/api/products/fixed-price/?search=your-query&page_size=10`
- **Status:** 200 OK
- **Response:** Contains `results` array with FixedPriceListing objects

**Edge Cases to Test:**
- ❌ Search with no results → Shows "No products found" message
- ❌ Clear search (X button) → Results clear immediately
- ⌨️ Press Enter → Triggers "View all results" action

---

## ✅ 3. Testing Wishlist (Just Integrated)

### Prerequisites
- ⚠️ **Must be logged in** to test wishlist

### Add to Wishlist Test
1. Navigate to **Products Page** or **Home Page**
2. Find any product card
3. Click the **Heart icon** (top-right corner of product card)

**Expected Results:**
- ✅ Heart icon fills with red color
- ✅ Toast notification: "Added to wishlist"
- ✅ Product appears in wishlist page

**Check Backend Call:**
- Open **DevTools → Network Tab**
- Look for: `POST http://localhost:8000/api/wishlist/add/`
- **Status:** 201 Created
- **Request Body:** `{ "product_id": 123, "notes": "" }`
- **Response:** Contains `id`, `product`, `user`, `created_at`

### View Wishlist Test
1. Click **Heart icon** in header (or navigate to `/wishlist`)
2. View your wishlist items

**Expected Results:**
- ✅ All wishlist items display with:
  - Product image
  - Product name
  - Seller name
  - Category
  - Price (fixed_price or auction current_price)
  - Stock status (if available)
  - Your notes (if any)
- ✅ "Remove" button for each item
- ✅ "Add to Cart" button (for fixed price items)

**Check Backend Call:**
- Look for: `GET http://localhost:8000/api/wishlist/`
- **Status:** 200 OK
- **Response:** Array of WishlistItem objects with nested product data

### Remove from Wishlist Test
1. On wishlist page, click **"Remove"** button
2. Or click heart icon again on product card

**Expected Results:**
- ✅ Item removed from wishlist immediately
- ✅ Toast notification: "Removed from wishlist"
- ✅ Heart icon becomes outline (unfilled)

**Check Backend Call:**
- Look for: `DELETE http://localhost:8000/api/wishlist/{id}/remove/`
- **Status:** 204 No Content

---

## ✅ 4. Testing Reviews (Service Created, Not Yet Integrated in UI)

### Get Product Reviews Test
**Manual API Test (use browser console):**

```javascript
// Open browser console on any page while logged in
import { reviewService } from './services/reviewService';

// Get reviews for a product (replace 123 with real product ID)
const reviews = await reviewService.getProductReviews(123);
console.log('Product Reviews:', reviews);
```

**Expected Backend Call:**
- `GET http://localhost:8000/api/reviews/product/123/`
- **Status:** 200 OK
- **Response:** Array of ProductReview objects with ratings and comments

### Create Order Feedback Test
**This will be available after order completion in OrderSuccessPage**

**Manual API Test:**
```javascript
// In browser console
import { reviewService } from './services/reviewService';

// Create feedback for an order (replace 456 with real order ID)
const feedback = await reviewService.createFeedback({
  order: 456,
  product_quality: 5,
  delivery_speed: 4,
  seller_service: 5,
  comment: 'Great product!'
});
console.log('Feedback created:', feedback);
```

**Expected Backend Call:**
- `POST http://localhost:8000/api/feedback/`
- **Status:** 201 Created

---

## 🔍 General Testing Tips

### 1. Check Browser Console
Open **DevTools → Console** to see:
- Error messages
- API response logs
- Auth token status
- Toast notifications

### 2. Check Network Tab
Open **DevTools → Network Tab** to verify:
- API calls are being made
- Status codes (200, 201, 204, etc.)
- Request/response payloads
- Headers (Authorization token included)

### 3. Check Auth Token
```javascript
// In browser console
console.log('Auth Token:', localStorage.getItem('token'));
```

**Expected:** Should show your auth token string

### 4. Test Error Handling
Try these scenarios:
- ❌ Search while backend is down → Should show error toast
- ❌ Add to wishlist without login → Should prompt to login
- ❌ Network error → Should show appropriate error message

---

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or API calls fail

**Solution:**
1. Verify backend is running: `http://localhost:8000/api/`
2. Check CORS settings in backend
3. Verify API base URL in `src/lib/apiClient.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

### Issue: "Unauthorized" or 401 errors

**Solution:**
1. Check if logged in
2. Verify token in localStorage: `localStorage.getItem('token')`
3. Try logging out and logging back in
4. Check token format: Should be "Token abc123..." not "Bearer abc123..."

### Issue: Search shows no results

**Solution:**
1. Verify products exist in backend database
2. Check backend search is working: `http://localhost:8000/api/products/fixed-price/?search=test`
3. Check console for errors
4. Try different search terms

### Issue: Wishlist not loading

**Solution:**
1. Ensure you're logged in
2. Check Network tab for API call
3. Verify wishlist endpoint returns data
4. Check console for errors in WishlistContext

---

## 📊 Testing Checklist

### Authentication ✅
- [x] Login works
- [x] Token stored in localStorage
- [x] Token sent in API headers
- [x] User profile loads
- [x] Logout works

### Search ✅
- [ ] Search input appears
- [ ] Typing triggers debounced search
- [ ] Loading spinner shows
- [ ] Results display correctly
- [ ] Images load
- [ ] Prices format correctly
- [ ] Click result navigates to detail page
- [ ] Empty results shows message
- [ ] Clear search works

### Wishlist ✅
- [ ] Add to wishlist works (with login)
- [ ] Heart icon toggles correctly
- [ ] Wishlist page displays items
- [ ] Remove from wishlist works
- [ ] Toast notifications appear
- [ ] Images and prices display correctly
- [ ] Auto-loads on login

### Reviews (Service Ready)
- [ ] Service file exists at `src/services/reviewService.ts`
- [ ] Can manually test API calls in console
- [ ] Ready for UI integration

---

## 🎯 Quick Test Script

Run this in your browser console after logging in:

```javascript
// Test 1: Check authentication
console.log('1. Auth Token:', localStorage.getItem('token') ? '✅ Present' : '❌ Missing');

// Test 2: Search products
fetch('http://localhost:8000/api/products/fixed-price/?search=carpet&page_size=5', {
  headers: {
    'Authorization': 'Token ' + localStorage.getItem('token')
  }
})
  .then(r => r.json())
  .then(d => console.log('2. Search Results:', d.results?.length || 0, 'products found'))
  .catch(e => console.error('2. Search Failed:', e));

// Test 3: Get wishlist
fetch('http://localhost:8000/api/wishlist/', {
  headers: {
    'Authorization': 'Token ' + localStorage.getItem('token')
  }
})
  .then(r => r.json())
  .then(d => console.log('3. Wishlist:', Array.isArray(d) ? d.length + ' items' : '❌ Error'))
  .catch(e => console.error('3. Wishlist Failed:', e));

console.log('✅ Tests running... Check results above');
```

---

## 📝 Next Steps

After verifying these integrations work:

1. **Test with real data** from your backend
2. **Check edge cases** (empty states, errors, etc.)
3. **Move to next integration**: Auction System (WebSocket + REST API)
4. **Document any bugs** you find

---

## 💡 Need Help?

If something doesn't work:
1. Check the Network tab for exact error
2. Check Console for JavaScript errors
3. Verify backend API is returning expected data structure
4. Compare request/response with backend documentation in `backend_docs/`
