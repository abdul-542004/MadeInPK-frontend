import { createContext, useContext, useState, ReactNode } from "react";
import { mockProducts } from "../data/mockProducts";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
  productId?: string;
}

interface ChatbotContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sendMessage: (text: string, currentPage?: string) => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Product knowledge base with heritage information
const productHeritage: Record<string, string> = {
  textiles: "Pakistani textiles represent centuries of weaving tradition. From the intricate patterns of Sindhi ajrak to the delicate embroidery of Kashmiri shawls, each piece tells a story of our rich cultural heritage.",
  pottery: "Pakistani pottery dates back to the ancient Indus Valley Civilization. Cities like Multan are famous for their blue pottery, which features geometric Islamic patterns and has been perfected over generations.",
  jewelry: "Traditional Pakistani jewelry combines Mughal artistry with regional craftsmanship. From the intricate gold work of Punjab to the silver tribal jewelry of Khyber Pakhtunkhwa, each piece is a wearable work of art.",
  carpets: "Hand-knotted carpets from Pakistan are world-renowned. Persian-influenced designs from Kashmir and geometric patterns from Balochistan showcase the skill passed down through generations of master weavers.",
  metalwork: "Pakistani metalwork, especially brass and copper craftsmanship, has roots in the Mughal era. Moradabad and Chiniot are famous for their intricate metal engravings and traditional utensils.",
};

// Knowledge base for chatbot responses
const knowledgeBase = {
  greeting: [
    "Hello! Welcome to MadeInPK! 🇵🇰 I'm here to help you discover authentic Pakistani handicrafts. How can I assist you today?",
    "Assalam-o-Alaikum! Welcome to MadeInPK! I can help you find products, explain their heritage, or guide you through our website. What are you interested in?",
    "Hi there! 👋 I'm your MadeInPK assistant. Whether you're looking for handcrafted textiles, pottery, jewelry, or want to learn about Pakistani heritage, I'm here to help!",
  ],
  about: "MadeInPK is dedicated to promoting authentic Pakistani handicrafts and preserving our rich cultural heritage. We connect skilled artisans with customers worldwide, ensuring fair prices and showcasing the beautiful traditions of Pakistan.",
  shipping: "We offer shipping across Pakistan with delivery times of 3-7 business days depending on your location. For international orders, delivery takes 10-15 business days. All items are carefully packaged to ensure safe delivery.",
  returns: "We have a 7-day return policy for items in original condition. If you're not satisfied with your purchase, please contact us and we'll help you with the return process.",
  payment: "We accept various payment methods including cash on delivery, bank transfers, and online payment. All transactions are secure and your payment information is protected.",
  auctions: "Our auction system lets you bid on unique, limited-edition handicrafts. Browse active auctions, place your bid, and watch the countdown timer. If you win, we'll notify you and the seller will contact you to arrange delivery!",
  seller: "Want to sell your handicrafts? Click 'Become a Seller' in your account menu. You'll need to provide business details, and once approved, you can list products and manage orders through your seller dashboard.",
  categories: {
    textiles: "Our textile collection includes ajrak, block-printed fabrics, embroidered shawls, khaddar, and traditional clothing. Each piece showcases regional weaving and embroidery techniques.",
    pottery: "Discover traditional blue pottery from Multan, terracotta pieces, decorative tiles, and ceramic dinnerware. Each item is handcrafted using age-old techniques.",
    jewelry: "Browse our collection of handcrafted jewelry including gold and silver pieces, kundan work, tribal jewelry, and traditional bridal sets.",
    carpets: "Our carpets include hand-knotted silk and wool rugs, prayer mats, and wall hangings featuring Persian and geometric designs.",
    metalwork: "Explore brass and copper items including traditional utensils, decorative pieces, and intricate metalwork from Moradabad and Chiniot.",
  },
  heritage: "Pakistani handicrafts represent over 5,000 years of cultural heritage, from the Indus Valley Civilization to the Mughal Empire. Each region has unique crafts: Punjab's truck art, Sindh's ajrak, Balochistan's mirror work, and Khyber Pakhtunkhwa's woodwork. These crafts are not just products but living traditions passed through generations.",
};

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: knowledgeBase.greeting[0],
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const generateBotResponse = (userMessage: string, currentPage?: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (
      lowerMessage.match(/^(hi|hello|hey|salam|assalam|greetings)/i)
    ) {
      return knowledgeBase.greeting[Math.floor(Math.random() * knowledgeBase.greeting.length)];
    }

    // About MadeInPK
    if (lowerMessage.includes("about") || lowerMessage.includes("madeinpk") || lowerMessage.includes("what is this")) {
      return knowledgeBase.about;
    }

    // Shipping
    if (lowerMessage.includes("ship") || lowerMessage.includes("deliver") || lowerMessage.includes("delivery")) {
      return knowledgeBase.shipping;
    }

    // Returns
    if (lowerMessage.includes("return") || lowerMessage.includes("refund") || lowerMessage.includes("exchange")) {
      return knowledgeBase.returns;
    }

    // Payment
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("cod") || lowerMessage.includes("cash")) {
      return knowledgeBase.payment;
    }

    // Auctions
    if (lowerMessage.includes("auction") || lowerMessage.includes("bid") || lowerMessage.includes("bidding")) {
      return knowledgeBase.auctions;
    }

    // Seller
    if (lowerMessage.includes("sell") || lowerMessage.includes("seller") || lowerMessage.includes("vendor")) {
      return knowledgeBase.seller;
    }

    // Heritage
    if (lowerMessage.includes("heritage") || lowerMessage.includes("history") || lowerMessage.includes("tradition") || lowerMessage.includes("culture")) {
      return knowledgeBase.heritage;
    }

    // Category-specific queries
    if (lowerMessage.includes("textile") || lowerMessage.includes("fabric") || lowerMessage.includes("cloth") || lowerMessage.includes("ajrak")) {
      return `${knowledgeBase.categories.textiles}\n\n${productHeritage.textiles}`;
    }

    if (lowerMessage.includes("pottery") || lowerMessage.includes("ceramic") || lowerMessage.includes("clay")) {
      return `${knowledgeBase.categories.pottery}\n\n${productHeritage.pottery}`;
    }

    if (lowerMessage.includes("jewelry") || lowerMessage.includes("jewellery") || lowerMessage.includes("necklace") || lowerMessage.includes("earring")) {
      return `${knowledgeBase.categories.jewelry}\n\n${productHeritage.jewelry}`;
    }

    if (lowerMessage.includes("carpet") || lowerMessage.includes("rug") || lowerMessage.includes("mat")) {
      return `${knowledgeBase.categories.carpets}\n\n${productHeritage.carpets}`;
    }

    if (lowerMessage.includes("metal") || lowerMessage.includes("brass") || lowerMessage.includes("copper")) {
      return `${knowledgeBase.categories.metalwork}\n\n${productHeritage.metalwork}`;
    }

    // Product search
    if (lowerMessage.includes("show me") || lowerMessage.includes("find") || lowerMessage.includes("looking for")) {
      const products = mockProducts.filter((p) =>
        lowerMessage.split(" ").some((word) => p.name.toLowerCase().includes(word) || p.category.toLowerCase().includes(word))
      );

      if (products.length > 0) {
        const productList = products.slice(0, 3).map((p) => `• ${p.name} - Rs ${p.price}`).join("\n");
        return `I found these products that might interest you:\n\n${productList}\n\nWould you like to know more about any of these products?`;
      }
    }

    // Specific product inquiry
    const product = mockProducts.find((p) => 
      lowerMessage.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(lowerMessage)
    );

    if (product) {
      const heritageInfo = productHeritage[product.category.toLowerCase()] || "This product represents the finest Pakistani craftsmanship.";
      return `${product.name} (Rs ${product.price})\n\n${product.description}\n\n🎨 Cultural Heritage:\n${heritageInfo}\n\nWould you like to view this product?`;
    }

    // Price inquiry
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("expensive")) {
      return "Our products range from Rs 500 to Rs 50,000 depending on the craftsmanship and materials. Each item is priced fairly to ensure artisans receive proper compensation for their skill. What category are you interested in?";
    }

    // Help
    if (lowerMessage.includes("help")) {
      return "I can help you with:\n\n• Finding products and explaining their heritage\n• Information about shipping and returns\n• How to place orders and bid on auctions\n• Becoming a seller\n• Learning about Pakistani handicraft traditions\n\nWhat would you like to know?";
    }

    // Default response
    return "I'm here to help you discover authentic Pakistani handicrafts! You can ask me about:\n\n• Products and their cultural significance\n• Shipping, returns, and payment\n• Our auction system\n• Becoming a seller\n• Pakistani heritage and traditions\n\nWhat would you like to know?";
  };

  const sendMessage = (text: string, currentPage?: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate and add bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `bot_${Date.now()}`,
        text: generateBotResponse(text, currentPage),
        sender: "bot",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: "welcome",
        text: knowledgeBase.greeting[0],
        sender: "bot",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
