import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Auction, Bid } from '../types/product';
import { productService } from '../services/productService';
import { MOCK_MODE, mockDelay } from '../lib/mockMode';

// Backward compatibility: Notification handler
let addNotificationGlobal: ((notification: any) => void) | null = null;

export function setNotificationHandler(handler: (notification: any) => void) {
  addNotificationGlobal = handler;
}

interface AuctionContextType {
  auctions: Auction[];
  myAuctions: Auction[];
  myBids: Auction[];
  loading: boolean;
  createAuction: (auction: any) => Promise<void>;
  placeBid: (auctionId: number, amount: number) => Promise<boolean>;
  deleteAuction: (auctionId: number) => Promise<void>;
  getAuction: (auctionId: number) => Auction | undefined;
  refreshAuctions: () => Promise<void>;
  connectToAuction: (auctionId: number) => void;
  disconnectFromAuction: (auctionId: number) => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within AuctionProvider');
  }
  return context;
};

// Mock auction data
const MOCK_AUCTIONS: Auction[] = [
  {
    id: 1,
    product: {
      id: 1,
      name: 'Handcrafted Wooden Chess Set',
      description: 'Beautiful handcrafted wooden chess set from Swat valley',
      images: [{
        id: 1,
        image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800',
        image_url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800',
        is_primary: true,
        order: 1
      }],
      seller_username: 'artisan_pk',
      category_name: 'Handicrafts',
      seller: 1,
      category: 1,
      condition: 'new',
      listing_type: 'auction',
      average_rating: null,
      total_reviews: 0,
      seller_profile: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    starting_price: '5000.00',
    current_price: '7500.00',
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    winner: null,
    winner_username: null,
    latest_bids: [
      {
        id: 1,
        bidder: 2,
        bidder_username: 'user123',
        amount: '7500.00',
        bid_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        is_winning: true,
      },
    ],
    total_bids: 5,
    time_remaining: 79200,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    product: {
      id: 2,
      name: 'Traditional Embroidered Shawl',
      description: 'Authentic Kashmiri embroidered shawl',
      images: [{
        id: 2,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
        image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
        is_primary: true,
        order: 1
      }],
      seller_username: 'textile_master',
      category_name: 'Textiles',
      seller: 2,
      category: 2,
      condition: 'new',
      listing_type: 'auction',
      average_rating: null,
      total_reviews: 0,
      seller_profile: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    starting_price: '8000.00',
    current_price: '12000.00',
    start_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    winner: null,
    winner_username: null,
    latest_bids: [
      {
        id: 2,
        bidder: 3,
        bidder_username: 'collector_pk',
        amount: '12000.00',
        bid_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        is_winning: true,
      },
    ],
    total_bids: 8,
    time_remaining: 25200,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);
  const wsConnectionsRef = useRef<Map<number, WebSocket>>(new Map());

  // Load auctions on mount
  useEffect(() => {
    loadAuctions();
  }, []);

  // Cleanup WebSocket connections on unmount
  useEffect(() => {
    return () => {
      wsConnectionsRef.current.forEach(ws => ws.close());
      wsConnectionsRef.current.clear();
    };
  }, []);

  const loadAuctions = async () => {
    if (MOCK_MODE) {
      const stored = localStorage.getItem('mock_auctions');
      if (stored) {
        try {
          setAuctions(JSON.parse(stored));
        } catch {
          setAuctions(MOCK_AUCTIONS);
          localStorage.setItem('mock_auctions', JSON.stringify(MOCK_AUCTIONS));
        }
      } else {
        setAuctions(MOCK_AUCTIONS);
        localStorage.setItem('mock_auctions', JSON.stringify(MOCK_AUCTIONS));
      }
      return;
    }

    // Backend mode
    try {
      setLoading(true);
      const response = await productService.getAuctions({ status: 'active' });
      setAuctions(response.results);
    } catch (error: any) {
      console.error('Error loading auctions:', error);
      toast.error(error.response?.data?.message || 'Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const refreshAuctions = async () => {
    await loadAuctions();
  };

  const placeBid = async (auctionId: number, amount: number): Promise<boolean> => {
    if (!isAuthenticated) {
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

    const currentPrice = parseFloat(auction.current_price);
    if (amount <= currentPrice) {
      toast.error(`Bid must be higher than current price of Rs ${currentPrice}`);
      return false;
    }

    if (MOCK_MODE) {
      await mockDelay();
      
      const newBid: Bid = {
        id: Date.now(),
        bidder: user?.id || 0,
        bidder_username: user?.username || 'Anonymous',
        amount: amount.toString(),
        bid_time: new Date().toISOString(),
        is_winning: true,
      };

      const updatedAuctions = auctions.map(a => {
        if (a.id === auctionId) {
          const updatedBids = a.latest_bids.map(b => ({ ...b, is_winning: false }));
          
          return {
            ...a,
            current_price: amount.toString(),
            latest_bids: [newBid, ...updatedBids].slice(0, 10),
            total_bids: a.total_bids + 1,
          };
        }
        return a;
      });

      setAuctions(updatedAuctions);
      localStorage.setItem('mock_auctions', JSON.stringify(updatedAuctions));
      toast.success('Bid placed successfully!');
      return true;
    }

    // Backend mode
    try {
      await productService.placeBid(auctionId, amount);
      await refreshAuctions();
      toast.success('Bid placed successfully!');
      return true;
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.response?.data?.message || 'Failed to place bid');
      return false;
    }
  };

  const connectToAuction = (auctionId: number) => {
    if (MOCK_MODE || wsConnectionsRef.current.has(auctionId)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token found for WebSocket connection');
        return;
      }

      const wsUrl = `ws://localhost:8000/ws/auction/${auctionId}/?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`Connected to auction ${auctionId} WebSocket`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'auction_status') {
            setAuctions(prev => prev.map(a => 
              a.id === auctionId ? { ...a, ...data.auction } : a
            ));
          } else if (data.type === 'new_bid') {
            setAuctions(prev => prev.map(a => {
              if (a.id === auctionId) {
                return {
                  ...a,
                  current_price: data.bid.amount,
                  latest_bids: [data.bid, ...a.latest_bids].slice(0, 10),
                  total_bids: a.total_bids + 1,
                };
              }
              return a;
            }));

            const currentAuction = auctions.find(a => a.id === auctionId);
            if (isAuthenticated && currentAuction && currentAuction.latest_bids[0]?.bidder === user?.id && data.bid.bidder !== user?.id) {
              toast.warning(`You've been outbid on ${currentAuction.product.name}!`);
            }
          } else if (data.type === 'auction_ended') {
            setAuctions(prev => prev.map(a =>
              a.id === auctionId ? { ...a, status: 'ended', ...data.auction } : a
            ));

            if (isAuthenticated && data.auction.winner === user?.id) {
              toast.success(`Congratulations! You won the auction for ${data.auction.product.name}!`);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for auction ${auctionId}:`, error);
      };

      ws.onclose = () => {
        console.log(`Disconnected from auction ${auctionId} WebSocket`);
        wsConnectionsRef.current.delete(auctionId);
      };

      wsConnectionsRef.current.set(auctionId, ws);
    } catch (error) {
      console.error(`Error connecting to auction ${auctionId}:`, error);
    }
  };

  const disconnectFromAuction = (auctionId: number) => {
    const ws = wsConnectionsRef.current.get(auctionId);
    if (ws) {
      ws.close();
      wsConnectionsRef.current.delete(auctionId);
    }
  };

  const getAuction = (auctionId: number): Auction | undefined => {
    return auctions.find(a => a.id === auctionId);
  };

  // Backward compatibility stubs
  const createAuction = async (auctionData: any): Promise<void> => {
    toast.info('Please create auctions via the Products page', {
      description: 'Go to Products > Add Product and select "Auction" as the listing type'
    });
  };

  const deleteAuction = async (auctionId: number): Promise<void> => {
    toast.info('Please delete auctions via the Products page', {
      description: 'Auctions can be managed through your product listings'
    });
  };

  // Get auctions created by current user (seller)
  const myAuctions = user && isAuthenticated
    ? auctions.filter(a => a.product.seller_username === user.username)
    : [];

  // Get auctions where current user has placed bids
  const myBids = user && isAuthenticated
    ? auctions.filter(a => a.latest_bids.some(b => b.bidder === user.id))
    : [];

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        myAuctions,
        myBids,
        loading,
        createAuction,
        placeBid,
        deleteAuction,
        getAuction,
        refreshAuctions,
        connectToAuction,
        disconnectFromAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export default AuctionContext;
