# MadeInPK AI Chatbot Guide

## Overview

An intelligent chatbot assistant has been integrated into the MadeInPK website to help users discover products, learn about Pakistani heritage, and navigate the platform.

## Features

### 🤖 **Intelligent Responses**
The chatbot understands and responds to various queries about:
- **Products:** Search, recommendations, and details
- **Heritage:** Cultural significance and traditions
- **Orders:** Shipping, returns, and payment info
- **Auctions:** How to bid and participate
- **Seller Info:** How to become a seller
- **Navigation:** Help finding specific pages

### 🎨 **Beautiful UI**
- **Floating chat button** in bottom-right corner
- **Gradient emerald theme** matching MadeInPK branding
- **Smooth animations** using Motion (Framer Motion)
- **Online status indicator** with green dot
- **Minimizable chat window**
- **Auto-scroll** to latest messages
- **Timestamp** on each message

### ✨ **Quick Actions**
Three instant-click buttons for common queries:
- 📦 Browse Products
- ❤️ Heritage Info
- ℹ️ Help

### 🧠 **Product Knowledge**
The chatbot has built-in knowledge about:
- **Textiles:** Ajrak, embroidery, traditional fabrics
- **Pottery:** Blue pottery, terracotta, ceramics
- **Jewelry:** Gold, silver, kundan work
- **Carpets:** Hand-knotted rugs, silk carpets
- **Metalwork:** Brass, copper craftsmanship

## What the Chatbot Can Do

### 1. **Greet Users**
Responds to: hi, hello, hey, salam, assalam
```
Example: "Hello"
Response: "Assalam-o-Alaikum! Welcome to MadeInPK!..."
```

### 2. **Explain Products**
Responds to product names or categories
```
Example: "Tell me about textiles"
Response: Detailed information about Pakistani textiles + heritage context
```

### 3. **Search Products**
Responds to: show me, find, looking for
```
Example: "Show me carpets"
Response: List of relevant products with prices
```

### 4. **Heritage Information**
Responds to: heritage, history, tradition, culture
```
Example: "Tell me about Pakistani heritage"
Response: Comprehensive overview of 5,000+ years of craftsmanship
```

### 5. **Shipping & Delivery**
Responds to: ship, deliver, delivery
```
Example: "How long does shipping take?"
Response: Detailed shipping information for local and international orders
```

### 6. **Returns & Refunds**
Responds to: return, refund, exchange
```
Example: "What's your return policy?"
Response: 7-day return policy details
```

### 7. **Payment Methods**
Responds to: payment, pay, cod, cash
```
Example: "What payment methods do you accept?"
Response: List of available payment options
```

### 8. **Auction Help**
Responds to: auction, bid, bidding
```
Example: "How do auctions work?"
Response: Complete auction system explanation
```

### 9. **Seller Information**
Responds to: sell, seller, vendor
```
Example: "How can I become a seller?"
Response: Step-by-step seller registration guide
```

### 10. **Price Inquiry**
Responds to: price, cost, expensive
```
Example: "What are your price ranges?"
Response: Price range information (Rs 500 - Rs 50,000)
```

### 11. **Help & Support**
Responds to: help
```
Example: "I need help"
Response: List of available help topics
```

## Heritage Knowledge Base

The chatbot provides detailed cultural context for each category:

### **Textiles**
"Pakistani textiles represent centuries of weaving tradition. From the intricate patterns of Sindhi ajrak to the delicate embroidery of Kashmiri shawls, each piece tells a story of our rich cultural heritage."

### **Pottery**
"Pakistani pottery dates back to the ancient Indus Valley Civilization. Cities like Multan are famous for their blue pottery, which features geometric Islamic patterns and has been perfected over generations."

### **Jewelry**
"Traditional Pakistani jewelry combines Mughal artistry with regional craftsmanship. From the intricate gold work of Punjab to the silver tribal jewelry of Khyber Pakhtunkhwa, each piece is a wearable work of art."

### **Carpets**
"Hand-knotted carpets from Pakistan are world-renowned. Persian-influenced designs from Kashmir and geometric patterns from Balochistan showcase the skill passed down through generations of master weavers."

### **Metalwork**
"Pakistani metalwork, especially brass and copper craftsmanship, has roots in the Mughal era. Moradabad and Chiniot are famous for their intricate metal engravings and traditional utensils."

## User Interface

### **Chat Button**
- **Location:** Fixed bottom-right corner
- **Size:** 56x56px rounded circle
- **Color:** Emerald gradient with white icon
- **Animation:** Scales in smoothly when chat is closed
- **Badge:** Red pulse indicator showing chatbot is active

### **Chat Window**
- **Size:** 380px wide on mobile, 420px on desktop
- **Height:** 500px (fixed)
- **Position:** Bottom-right corner with spacing
- **Shadow:** Large shadow for depth

### **Header (Emerald Gradient)**
- Avatar with sparkles icon
- Status: "Online • Here to help"
- Minimize button
- Close button

### **Messages Area**
- Auto-scrolling
- User messages: Right-aligned, emerald background
- Bot messages: Left-aligned, gray background
- Timestamps on all messages
- Avatar icons for both user and bot

### **Input Area**
- Text input with placeholder
- Send button (emerald)
- Clear conversation button (appears after 2+ messages)

## Technical Implementation

### **Context Structure**
```typescript
ChatbotContext provides:
- messages: Array of chat messages
- isOpen: Chat window visibility state
- sendMessage: Function to send user messages
- clearMessages: Function to clear chat history
```

### **Message Format**
```typescript
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
  productId?: string;
}
```

### **Response Generation**
The chatbot uses pattern matching and keyword detection to generate contextually relevant responses. It searches for keywords in the user's message and provides appropriate information from the knowledge base.

## Integration Points

### **Product Integration**
- Accesses `mockProducts.ts` for real product data
- Can search and filter products
- Provides accurate pricing information

### **Heritage Information**
- Built-in heritage knowledge base
- Category-specific cultural context
- Historical background for each craft type

### **Website Navigation**
- Can guide users to different pages
- Explains website features
- Helps with account and order management

## Usage Examples

### **Example 1: Product Discovery**
```
User: "Show me traditional jewelry"
Bot: Lists 3 relevant jewelry products with prices
Bot: Explains heritage of Pakistani jewelry
```

### **Example 2: Heritage Learning**
```
User: "Tell me about Pakistani pottery"
Bot: Explains pottery category
Bot: Provides historical context from Indus Valley Civilization
Bot: Mentions famous pottery cities like Multan
```

### **Example 3: Shopping Help**
```
User: "How does delivery work?"
Bot: Explains 3-7 days local shipping
Bot: Mentions 10-15 days international shipping
Bot: Confirms careful packaging
```

### **Example 4: Becoming a Seller**
```
User: "I want to sell my crafts"
Bot: Explains seller registration process
Bot: Lists required information
Bot: Guides to seller dashboard features
```

## Accessibility Features

- **Keyboard navigation:** Enter key sends messages
- **Auto-focus:** Input focuses when chat opens
- **Screen reader friendly:** Proper ARIA labels
- **High contrast:** Readable text colors
- **Large touch targets:** Easy to tap on mobile

## Performance

- **Lazy loading:** Chat loads only when needed
- **Efficient rendering:** Only visible messages rendered
- **Smooth animations:** Hardware-accelerated transforms
- **Local storage:** Optional message persistence (future feature)

## Future Enhancements

### Planned Features:
- [ ] **Voice input:** Speak to the chatbot
- [ ] **Image recognition:** Upload product images for identification
- [ ] **Multi-language:** Support for Urdu and regional languages
- [ ] **Order tracking:** Real-time order status in chat
- [ ] **Live agent handoff:** Connect to human support
- [ ] **Product recommendations:** AI-powered suggestions
- [ ] **Saved conversations:** Persistent chat history
- [ ] **Rich media:** Send product cards and images

### Advanced AI Features:
- [ ] Natural language processing with real AI
- [ ] Sentiment analysis for better responses
- [ ] Learning from user interactions
- [ ] Personalized recommendations based on browsing history
- [ ] Context awareness across pages

## Testing Instructions

### **Basic Testing:**
1. Open any page on MadeInPK
2. Look for floating emerald chat button (bottom-right)
3. Click to open chat window
4. See welcome message from bot
5. Try quick action buttons

### **Product Search:**
1. Type: "Show me textiles"
2. See list of textile products
3. Type specific product name
4. Get detailed product info + heritage

### **Heritage Learning:**
1. Type: "Tell me about pottery"
2. Receive pottery information
3. Get historical context
4. Learn about Indus Valley Civilization

### **Help & Navigation:**
1. Type: "help"
2. See list of available help topics
3. Type: "how do auctions work"
4. Get detailed auction explanation

### **Conversation Flow:**
1. Have a multi-message conversation
2. Check timestamps on each message
3. Use "Clear conversation" button
4. Chat resets with welcome message

## Tips for Best Experience

✅ **Do:**
- Ask specific questions about products
- Inquire about heritage and traditions
- Ask for help with orders and shipping
- Use natural language
- Try the quick action buttons

❌ **Don't:**
- Expect real-time inventory updates (demo mode)
- Ask for personal data processing
- Expect external API connections
- Try to break the chatbot with malicious input

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Styling & Theming

All chatbot colors match MadeInPK's emerald green theme:
- Primary: `emerald-600` to `emerald-700`
- Hover: `emerald-700` to `emerald-800`
- Background: White with emerald accents
- Shadows: Soft emerald-tinted shadows

---

**Built with ❤️ for MadeInPK**  
Bringing Pakistani heritage to life through intelligent conversation!
