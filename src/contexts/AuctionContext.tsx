import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface Auction {
  id: string;
  sellerId: string;
  sellerName: string;
  productName: string;
  description: string;
  images: string[];
  basePrice: number;
  currentBid: number;
  startTime: number;
  endTime: number;
  duration: string;
  status: 'active' | 'ended';
  bids: Bid[];
  winnerId?: string;
  winnerName?: string;
}

interface AuctionContextType {
  auctions: Auction[];
  myAuctions: Auction[];
  myBids: Auction[];
  createAuction: (auction: Omit<Auction, 'id' | 'sellerId' | 'sellerName' | 'currentBid' | 'startTime' | 'endTime' | 'status' | 'bids'>) => void;
  placeBid: (auctionId: string, amount: number) => boolean;
  deleteAuction: (auctionId: string) => void;
  getAuction: (auctionId: string) => Auction | undefined;
  checkExpiredAuctions: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

// Dummy auction data for testing
const DUMMY_AUCTIONS: Auction[] = [
  {
    id: 'auction_demo_1',
    sellerId: 'seller@madeinpk.com',
    sellerName: 'Artisan Crafts Seller',
    productName: 'Vintage Hand-Carved Wooden Box',
    description: 'Exquisite hand-carved wooden jewelry box from Chiniot, Pakistan. Features intricate floral patterns and traditional geometric designs. Made from premium quality sheesham wood with a glossy finish. Perfect for storing jewelry, trinkets, or as a decorative piece. Dimensions: 10" x 8" x 6"',
    images: [
      'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=800&fit=crop',
    ],
    basePrice: 2500,
    currentBid: 3200,
    startTime: Date.now() - (2 * 60 * 60 * 1000), // Started 2 hours ago
    endTime: Date.now() + (22 * 60 * 60 * 1000), // Ends in 22 hours
    duration: '24 hours',
    status: 'active',
    bids: [
      {
        id: 'bid_1',
        auctionId: 'auction_demo_1',
        bidderId: 'customer1@example.com',
        bidderName: 'Ali Hassan',
        amount: 2700,
        timestamp: Date.now() - (90 * 60 * 1000),
      },
      {
        id: 'bid_2',
        auctionId: 'auction_demo_1',
        bidderId: 'customer2@example.com',
        bidderName: 'Sara Khan',
        amount: 3000,
        timestamp: Date.now() - (45 * 60 * 1000),
      },
      {
        id: 'bid_3',
        auctionId: 'auction_demo_1',
        bidderId: 'customer3@example.com',
        bidderName: 'Ahmed Malik',
        amount: 3200,
        timestamp: Date.now() - (15 * 60 * 1000),
      },
    ],
  },
  {
    id: 'auction_demo_2',
    sellerId: 'seller@madeinpk.com',
    sellerName: 'Artisan Crafts Seller',
    productName: 'Antique Brass Tea Set',
    description: 'Rare antique brass tea set from the Mughal era design. Includes teapot, sugar bowl, and 4 cups with matching tray. Hand-engraved with traditional Persian motifs. Excellent condition with natural patina. A perfect addition to any collection or for serving guests in style.',
    images: [
      'https://images.unsplash.com/photo-1602874801006-94d67b8d6e2c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop',
    ],
    basePrice: 4500,
    currentBid: 5800,
    startTime: Date.now() - (1 * 24 * 60 * 60 * 1000), // Started 1 day ago
    endTime: Date.now() + (1 * 24 * 60 * 60 * 1000), // Ends in 1 day
    duration: '2 days',
    status: 'active',
    bids: [
      {
        id: 'bid_4',
        auctionId: 'auction_demo_2',
        bidderId: 'customer2@example.com',
        bidderName: 'Sara Khan',
        amount: 5000,
        timestamp: Date.now() - (6 * 60 * 60 * 1000),
      },
      {
        id: 'bid_5',
        auctionId: 'auction_demo_2',
        bidderId: 'customer4@example.com',
        bidderName: 'Fatima Ali',
        amount: 5800,
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'auction_demo_3',
    sellerId: 'seller@madeinpk.com',
    sellerName: 'Artisan Crafts Seller',
    productName: 'Handwoven Silk Carpet',
    description: 'Luxurious handwoven silk carpet from Kashmir. Size: 6ft x 4ft. Features 400 knots per square inch with vibrant floral medallion design in red, gold, and ivory. Took 8 months to complete. Certificate of authenticity included. This is a masterpiece that will last generations.',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591688731243-ce540f75e959?w=800&h=800&fit=crop',
    ],
    basePrice: 15000,
    currentBid: 15000,
    startTime: Date.now() - (30 * 60 * 1000), // Started 30 minutes ago
    endTime: Date.now() + (47.5 * 60 * 60 * 1000), // Ends in ~2 days
    duration: '2 days',
    status: 'active',
    bids: [],
  },
];

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load auctions from localStorage on mount, or initialize with dummy data
  useEffect(() => {
    const savedAuctions = localStorage.getItem('madeinpk_auctions');
    if (savedAuctions) {
      const parsed = JSON.parse(savedAuctions);
      setAuctions(parsed);
    } else {
      // Initialize with dummy data if no saved auctions
      setAuctions(DUMMY_AUCTIONS);
    }
    setInitialized(true);
  }, []);

  // Save auctions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('madeinpk_auctions', JSON.stringify(auctions));
  }, [auctions]);

  // Check for expired auctions every second
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredAuctions();
    }, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  const checkExpiredAuctions = () => {
    const now = Date.now();
    setAuctions(prev => prev.map(auction => {
      if (auction.status === 'active' && auction.endTime <= now) {
        // Auction just ended
        const winner = auction.bids.length > 0 
          ? auction.bids.reduce((prev, current) => 
              (current.amount > prev.amount) ? current : prev
            )
          : null;

        // Show notification to winner if they're logged in
        if (winner && user && user.email === winner.bidderId) {
          toast.success('🎉 Congratulations! You won the auction!', {
            description: `You won "${auction.productName}" with a bid of Rs ${winner.amount}`,
            duration: 5000,
          });
        }

        return {
          ...auction,
          status: 'ended' as const,
          winnerId: winner?.bidderId,
          winnerName: winner?.bidderName,
        };
      }
      return auction;
    }));
  };

  const createAuction = (auctionData: Omit<Auction, 'id' | 'sellerId' | 'sellerName' | 'currentBid' | 'startTime' | 'endTime' | 'status' | 'bids'>) => {
    if (!user || !user.isSeller) {
      toast.error('Only sellers can create auctions');
      return;
    }

    const durationMap: { [key: string]: number } = {
      '12 hours': 12 * 60 * 60 * 1000,
      '24 hours': 24 * 60 * 60 * 1000,
      '2 days': 2 * 24 * 60 * 60 * 1000,
      '3 days': 3 * 24 * 60 * 60 * 1000,
    };

    const startTime = Date.now();
    const endTime = startTime + (durationMap[auctionData.duration] || 24 * 60 * 60 * 1000);

    const newAuction: Auction = {
      ...auctionData,
      id: `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sellerId: user.email || '',
      sellerName: user.name || 'Unknown Seller',
      currentBid: auctionData.basePrice,
      startTime,
      endTime,
      status: 'active',
      bids: [],
    };

    setAuctions(prev => [newAuction, ...prev]);
    toast.success('Auction created successfully!', { duration: 2000 });
  };

  const placeBid = (auctionId: string, amount: number): boolean => {
    if (!user) {
      toast.error('Please login to place a bid');
      return false;
    }

    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) {
      toast.error('Auction not found');
      return false;
    }

    if (auction.status !== 'active') {
      toast.error('This auction has ended');
      return false;
    }

    if (auction.sellerId === user.email) {
      toast.error('You cannot bid on your own auction');
      return false;
    }

    if (amount <= auction.currentBid) {
      toast.error(`Bid must be higher than current bid of Rs ${auction.currentBid}`);
      return false;
    }

    const newBid: Bid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      auctionId,
      bidderId: user.email || '',
      bidderName: user.name || 'Anonymous',
      amount,
      timestamp: Date.now(),
    };

    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentBid: amount,
          bids: [newBid, ...a.bids],
        };
      }
      return a;
    }));

    toast.success('Bid placed successfully!', { duration: 2000 });
    return true;
  };

  const deleteAuction = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) {
      toast.error('Auction not found');
      return;
    }

    if (auction.sellerId !== user?.email) {
      toast.error('You can only delete your own auctions');
      return;
    }

    if (auction.bids.length > 0) {
      toast.error('Cannot delete auction with existing bids');
      return;
    }

    setAuctions(prev => prev.filter(a => a.id !== auctionId));
    toast.success('Auction deleted successfully!', { duration: 2000 });
  };

  const getAuction = (auctionId: string): Auction | undefined => {
    return auctions.find(a => a.id === auctionId);
  };

  // Get auctions created by current seller
  const myAuctions = user?.isSeller
    ? auctions.filter(a => a.sellerId === user.email)
    : [];

  // Get auctions where current user has placed bids
  const myBids = user 
    ? auctions.filter(a => a.bids.some(b => b.bidderId === user.email))
    : [];

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        myAuctions,
        myBids,
        createAuction,
        placeBid,
        deleteAuction,
        getAuction,
        checkExpiredAuctions,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};
