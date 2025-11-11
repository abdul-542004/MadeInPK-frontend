# Auction System Testing Guide

## Test Seller Account

Use these credentials to login as a seller and manage auction products:

**Email:** `seller@madeinpk.com`  
**Password:** `seller123` (or any password - authentication is mocked)

## Pre-loaded Auction Products

The system comes with 3 demo auction products created by the test seller:

### 1. Vintage Hand-Carved Wooden Box
- **Base Price:** Rs 2,500
- **Current Bid:** Rs 3,200
- **Time Remaining:** ~22 hours
- **Bids:** 3 existing bids
- **Status:** Active

### 2. Antique Brass Tea Set
- **Base Price:** Rs 4,500
- **Current Bid:** Rs 5,800
- **Time Remaining:** ~1 day
- **Bids:** 2 existing bids
- **Status:** Active

### 3. Handwoven Silk Carpet
- **Base Price:** Rs 15,000
- **Current Bid:** Rs 15,000 (no bids yet)
- **Time Remaining:** ~2 days
- **Bids:** 0
- **Status:** Active

## How to Test as a Seller

1. **Login:**
   - Click "Login" in the header
   - Use email: `seller@madeinpk.com`
   - Enter any password (mocked authentication)

2. **Access Seller Dashboard:**
   - Click on your profile icon
   - Click "Seller Dashboard" (you're already a registered seller)

3. **View Your Auctions:**
   - In the seller dashboard sidebar, click "Auction Products"
   - You'll see the "Active Auctions" tab with your 3 demo products
   - Click "Create Auction" tab to add new auction products

4. **Create New Auction:**
   - Fill in product details (name, description, images, base price)
   - Select auction duration (12h, 24h, 2 days, 3 days)
   - Click "Start Auction"

## How to Test as a Customer

1. **Create Customer Account:**
   - Click "Signup" in the header
   - Use any email (e.g., `customer@test.com`)
   - Enter name and password

2. **Browse Auctions:**
   - Click "Auction" in the navigation menu
   - You'll see all active auctions
   - Live countdown timers for each auction

3. **Place a Bid:**
   - Click on any auction product card
   - You'll see the auction detail page with:
     - Product images and description
     - Current highest bid
     - Real-time countdown timer
     - Bidding section
   
4. **Bidding Process:**
   - Enter your bid amount in the input field (must be higher than current bid)
   - OR use Quick Bid buttons (+Rs 100, +Rs 500, +Rs 1000)
   - Click "Place Bid" button
   - Your bid will be recorded and you'll see confirmation

5. **Track Your Bids:**
   - If you're the highest bidder, you'll see "You're Winning!" badge
   - Your bids appear in green in the "Recent Bids" section
   - Real-time updates as other users bid

## Features Implemented

### Seller Features:
✅ Create auction products with images, description, base price, and duration  
✅ View all active auctions in dedicated tab  
✅ See real-time bid count and current highest bid  
✅ Delete auctions (only if no bids placed)  
✅ Track auction status (active/ended)  
✅ View winner information when auction ends  

### Customer Features:
✅ Browse all active auctions with countdown timers  
✅ View detailed auction information  
✅ Place bids with validation (must be higher than current bid)  
✅ Quick bid buttons for faster bidding  
✅ Real-time countdown timers  
✅ See bid history for each auction  
✅ Track your own bids (highlighted in green)  
✅ Win notification when auction ends  
✅ Cannot bid on own auctions  

### System Features:
✅ Automatic auction expiration and winner selection  
✅ Persistent storage using localStorage  
✅ Real-time updates every second  
✅ Responsive design with emerald green theme  
✅ Toast notifications for all actions  
✅ Form validation and error handling  

## Important Notes

- **Authentication is mocked** - any password will work for demo purposes
- **Auctions auto-expire** - countdown timers are real-time and auctions end automatically
- **Winner selection** - highest bidder wins when auction ends
- **Data persistence** - auctions are saved to localStorage
- **Sellers cannot bid** - on their own auction products
- **Minimum bid increment** - must be at least Rs 1 higher than current bid

## Becoming a New Seller

If you create a new customer account and want to become a seller:

1. Login with your customer account
2. Click profile icon → "Become a Seller"
3. Fill out the seller registration form:
   - Business/Shop Name
   - Business Phone Number
   - Business Address
   - Business Description
   - Bank Details (optional)
4. Submit the form
5. You'll be redirected to the seller dashboard
6. Access "Auction Products" to create your auctions

---

**Enjoy testing the MadeInPK Auction System! 🎉**
