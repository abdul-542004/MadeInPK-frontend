import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Gavel, TrendingUp } from 'lucide-react';
import { auctionApi, AuctionListing } from '../services/api';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuctionPageProps {
  onAuctionClick?: (auctionId: string) => void;
}

const AuctionPage: React.FC<AuctionPageProps> = ({ onAuctionClick }) => {
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Fetch auctions from backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await auctionApi.getActiveAuctions();
        if (response.data) {
          setAuctions(response.data.results);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to load auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Update countdown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (timeRemaining: number) => {
    if (timeRemaining <= 0) return 'Ended';

    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const getTimeColor = (timeRemaining: number) => {
    const hours = timeRemaining / (60 * 60);
    if (hours < 1) return 'text-red-600';
    if (hours < 6) return 'text-orange-600';
    return 'text-emerald-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-emerald-800 mb-4">Loading Auctions...</h1>
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-red-600 mb-4">Error Loading Auctions</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeAuctions = auctions.filter(a => a.status === 'active');
  const endedAuctions = auctions.filter(a => a.status === 'ended');

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gavel className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-emerald-800 mb-4">Live Auctions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover unique Pakistani handcrafted items. Place your bid and win exclusive pieces!
          </p>
        </div>

        {/* Active Auctions */}
        {activeAuctions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-emerald-600 rounded-full"></div>
              <h2 className="text-emerald-800">Active Auctions</h2>
              <Badge className="bg-emerald-600">{activeAuctions.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAuctions.map((auction) => {
                const primaryImage = auction.product.images.find(img => img.is_primary) || auction.product.images[0];
                
                return (
                  <Card 
                    key={auction.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-emerald-300"
                    onClick={() => onAuctionClick?.(auction.id.toString())}
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={primaryImage?.image_url || '/placeholder-image.jpg'}
                          alt={auction.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-emerald-600 shadow-lg">
                        <Clock className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                      {auction.product.seller_profile?.is_verified && (
                        <Badge className="absolute top-3 left-3 bg-blue-600 shadow-lg">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-5">
                      <h3 className="text-emerald-800 mb-2 line-clamp-1">{auction.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        by {auction.product.seller_profile?.brand_name || auction.product.seller_username}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500">Starting</p>
                          <p className="text-emerald-700 text-sm">Rs {parseFloat(auction.starting_price).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Current</p>
                          <p className="text-emerald-700 text-sm flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Rs {parseFloat(auction.current_price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${getTimeColor(auction.time_remaining)}`} />
                          <span className={`text-sm ${getTimeColor(auction.time_remaining)}`}>
                            {formatTimeRemaining(auction.time_remaining)} left
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{auction.total_bids} bids</span>
                      </div>

                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md">
                        <Gavel className="w-4 h-4 mr-2" />
                        Place Bid
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Ended Auctions */}
        {endedAuctions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
              <h2 className="text-gray-700">Ended Auctions</h2>
              <Badge variant="secondary">{endedAuctions.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedAuctions.map((auction) => (
                <Card 
                  key={auction.id} 
                  className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => onAuctionClick?.(auction.id)}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={auction.images[0]}
                        alt={auction.productName}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-gray-600">
                      Ended
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-gray-700 mb-2 line-clamp-1">{auction.productName}</h3>
                    
                    <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Final Bid</p>
                        <p className="text-gray-700">Rs {auction.currentBid}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Bids</p>
                        <p className="text-gray-700">{auction.bids.length}</p>
                      </div>
                    </div>

                    {auction.winnerName && (
                      <p className="text-sm text-gray-600">Winner: {auction.winnerName}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {auctions.length === 0 && (
          <Card className="py-16">
            <CardContent className="text-center">
              <Gavel className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <h3 className="text-gray-700 mb-2">No Auctions Available</h3>
              <p className="text-gray-500">Check back soon for new auctions!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
