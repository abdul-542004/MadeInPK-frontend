
  # MadeInPK - Frontend

**MadeInPK Frontend** is a modern, responsive React application built with TypeScript, Vite, and Tailwind CSS. It provides an intuitive user interface for the MadeInPK e-commerce platform, featuring real-time auctions, fixed-price shopping, seller dashboards, and comprehensive buyer features.

## 🚀 Tech Stack

- **Framework:** React 18.3.1 + TypeScript
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.16
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React Context API
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Payments:** Stripe React + Stripe.js
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)

## ✨ Key Features

### For Buyers
- **Browse Products:** Fixed-price listings with filters (category, province, price range)
- **Live Auctions:** Real-time bidding with WebSocket updates
- **Shopping Cart:** Multi-seller cart with checkout
- **Wishlist:** Save products for later
- **Order Tracking:** View order history and status
- **Reviews:** Leave product reviews and seller feedback
- **Notifications:** Real-time + in-app notifications
- **Messaging:** Chat with sellers
- **Address Management:** Multiple shipping addresses
- **Secure Payments:** Stripe Checkout integration

### For Sellers
- **Dashboard:** Sales statistics and analytics
- **Product Management:** Add/edit products, images, inventory
- **Auction Management:** Create and manage timed auctions
- **Order Management:** View orders, mark as shipped
- **Earnings:** Track revenue and transactions
- **Stripe Connect:** Set up payout account
- **Analytics:** Product performance metrics

### For Admins
- **Admin Dashboard:** Platform-wide statistics
- **User Management:** Manage buyers and sellers
- **Order Management:** View and manage all orders
- **Revenue Analytics:** Platform earnings tracking

## 📦 Full Project Setup

This project requires the **backend** to be running:

**Backend Repository:** [github.com/abdul-542004/MadeInPK](https://github.com/abdul-542004/MadeInPK)

Make sure you have the Django backend running on `http://localhost:8000` before starting the frontend.

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** 20+ and **npm**
- **MadeInPK Backend** running on `http://localhost:8000`

### Quick Start

```bash
# Clone the repository
git clone https://github.com/abdul-542004/MadeInPK-frontend.git
cd MadeInPK-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open automatically at **http://localhost:3000** (configured in `vite.config.ts`).

---

## 🔧 Configuration

### Backend API URL

The frontend connects to the backend at `http://localhost:8000` by default. If your backend runs on a different URL, update the API base URL in:

**`src/services/api.ts`** or wherever the axios instance is configured.

### Environment Variables (Optional)

Create a `.env` file in the root if you need custom configuration:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

---

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── seller/         # Seller dashboard components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── HomePage.tsx    # Landing page
│   ├── ProductsPage.tsx       # Product listing
│   ├── ProductDetailPage.tsx  # Product details
│   ├── AuctionPage.tsx        # Auction listings
│   ├── AuctionDetailPage.tsx  # Live auction with WebSocket
│   ├── CartPage.tsx           # Shopping cart
│   ├── CheckoutPage.tsx       # Checkout flow
│   ├── MyOrdersPage.tsx       # Order history
│   ├── WishlistPage.tsx       # Saved products
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx         # Authentication state
│   ├── CartContext.tsx         # Shopping cart state
│   ├── WishlistContext.tsx     # Wishlist state
│   ├── AuctionContext.tsx      # Auction WebSocket connection
│   ├── NotificationContext.tsx # Notifications
│   ├── SellerContext.tsx       # Seller data
│   ├── AddressContext.tsx      # Address management
│   └── ChatbotContext.tsx      # Chatbot state
├── services/           # API services
│   ├── api.ts          # Axios configuration
│   ├── authService.ts  # Authentication API
│   ├── productService.ts      # Product API
│   ├── auctionService.ts      # Auction API
│   ├── orderService.ts        # Order API
│   └── ...
├── types/              # TypeScript type definitions
├── data/               # Mock data (for development)
├── lib/                # Utility functions
├── styles/             # Global styles
├── assets/             # Images and static files
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global CSS + Tailwind imports
```

---

## 🎨 Key Components

### Context Providers

All providers are wrapped in `App.tsx`:

- **AuthProvider** - User authentication, login/logout
- **CartProvider** - Shopping cart state and actions
- **WishlistProvider** - Wishlist management
- **AuctionProvider** - WebSocket connection for live auctions
- **NotificationProvider** - Real-time notifications
- **SellerProvider** - Seller dashboard data
- **AddressProvider** - Shipping address management
- **ChatbotProvider** - AI chatbot state

### Main Pages

| Page | Route | Description |
|------|-------|-------------|
| HomePage | `/` | Landing page with featured products |
| ProductsPage | `/products` | Browse fixed-price products |
| ProductDetailPage | `/products/:id` | Product details and reviews |
| AuctionPage | `/auctions` | Browse active auctions |
| AuctionDetailPage | `/auctions/:id` | Live auction with real-time bidding |
| CartPage | `/cart` | Shopping cart |
| CheckoutPage | `/checkout` | Stripe checkout |
| OrderSuccessPage | `/order-success` | Order confirmation |
| MyOrdersPage | `/my-orders` | Order history |
| WishlistPage | `/wishlist` | Saved products |
| SellerDashboard | `/seller-dashboard` | Seller analytics and management |
| AdminDashboard | `/admin-dashboard` | Admin platform management |
| AboutUsPage | `/about` | About the platform |
| HeritagePage | `/heritage` | Pakistani heritage showcase |

### UI Components (`components/ui/`)

Built with **Radix UI** and **shadcn/ui**:
- Button, Input, Dialog, Dropdown, Select
- Card, Badge, Avatar, Skeleton
- Tabs, Accordion, Popover, Tooltip
- Alert, Toast (Sonner), Progress
- And many more...

---

## 🔄 Real-time Features

### WebSocket Connection (Auctions)

The `AuctionContext` establishes a WebSocket connection to the backend for live auction updates:

```typescript
// WebSocket URL
ws://localhost:8000/ws/auction/{auction_id}/

// Receives:
- New bids in real-time
- Auction status updates
- Auction end notifications
```

### Notifications

Real-time notifications are handled via the `NotificationContext` and displayed using Sonner toasts.

---

## 🛒 Shopping Flow

1. **Browse Products** → Products page or Auctions page
2. **Add to Cart/Bid** → Cart for fixed-price, bid for auctions
3. **Checkout** → Stripe payment integration
4. **Payment** → Redirected to Stripe Checkout
5. **Success** → Order confirmation page
6. **Track Order** → My Orders page

---

## 💳 Stripe Integration

### Buyer Payment Flow
1. User clicks checkout
2. Frontend calls backend `/api/cart/checkout/`
3. Backend creates Stripe Checkout Session
4. User redirected to Stripe payment page
5. After payment, redirected to `/order-success`

### Seller Payout Setup
1. Seller navigates to dashboard settings
2. Clicks "Setup Stripe Account"
3. Redirected to Stripe Connect onboarding
4. Completes onboarding and returns to dashboard
5. Can now receive payments

---

## 🎭 Mock Mode

The app includes mock data for development without backend:

- Mock products (`src/data/mockProducts.ts`)
- Mock user data
- Mock orders

Set mock mode in relevant contexts if backend is unavailable.

---

## 🧪 Building for Production

```bash
# Build the app
npm run build

# Output will be in the `build/` directory
```

The build is optimized for production with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

---

## 🌐 Deployment

### Deploy to Vercel/Netlify

```bash
# Build command
npm run build

# Output directory
build

# Environment variables (set in platform)
VITE_API_BASE_URL=https://your-backend.com
VITE_WS_URL=wss://your-backend.com
```

---

## 🐛 Common Issues

### Backend Connection Error

**Error:** `Network Error` or `API calls failing`

**Solution:**
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend `.env`
- Verify `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

### WebSocket Not Connecting

**Solution:**
- Check if Daphne server is running (not Django's runserver)
- Verify Redis is running
- Check browser console for WebSocket errors

### Stripe Checkout Fails

**Solution:**
- Verify Stripe keys in backend `.env`
- Check Stripe webhook listener is running
- Ensure backend has valid `STRIPE_WEBHOOK_SECRET`

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.ts
server: {
  port: 5173,  // Change to different port
  open: true,
}
```

---

## 📚 Documentation

Full backend API documentation is available in the backend repository:

- `backend_docs/AUTHENTICATION_API.md`
- `backend_docs/PRODUCTS_AND_LISTINGS_API.md`
- `backend_docs/CART_AND_PAYMENTS_API.md`
- `backend_docs/ORDERS_AND_PAYMENTS_API.md`
- `backend_docs/WEBSOCKET_DOCUMENTATION.md`

Frontend-specific docs:

- `docs/API_INTEGRATION_COMPLETE.md` - API integration status
- `docs/AUTHENTICATION_TESTING_GUIDE.md` - Auth testing guide
- `docs/AUCTION_TESTING_GUIDE.md` - Auction testing guide
- `docs/MOCK_MODE_GUIDE.md` - Using mock data
- `docs/CHATBOT_GUIDE.md` - Chatbot features
- `docs/WEBSITE_STATUS.md` - Feature status

---

## 🎯 Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR). Changes reflect immediately.

### TypeScript
The project uses strict TypeScript. Define types in `src/types/`.

### Styling
- Use Tailwind utility classes
- Component styles in separate CSS files if needed
- Global styles in `index.css`

### API Calls
- All API calls should go through service files in `src/services/`
- Use axios interceptors for authentication headers
- Handle errors gracefully with try-catch

---

## 👥 Contributing

This is an educational project. Feel free to fork and modify.

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🙋 Support

For issues or questions:
- Create an issue on GitHub
- Email: abdullahkhan542004@gmail.com

---

**Happy Coding! 🚀**
  