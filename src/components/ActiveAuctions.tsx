import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Gavel, TrendingUp } from "lucide-react";
import { auctionApi, AuctionListing } from "../services/api";

interface ActiveAuctionsProps {
  onAuctionClick?: (auctionId: string) => void;
  onViewAllAuctions?: () => void;
}

export function ActiveAuctions({ onAuctionClick, onViewAllAuctions }: ActiveAuctionsProps) {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await auctionApi.getActiveAuctions();
        if (response.data) {
          // Take only the first 4 auctions for homepage display
          setAuctions(response.data.results.slice(0, 4));
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

  const formatTimeRemaining = (timeRemaining: number) => {
    if (timeRemaining <= 0) return 'Ended';

    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getTimeColor = (timeRemaining: number) => {
    const hours = timeRemaining / (60 * 60);
    if (hours < 1) return 'text-red-600';
    if (hours < 6) return 'text-orange-600';
    return 'text-emerald-700';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Live Auctions</h2>
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || auctions.length === 0) {
    return null; // Don't show section if no auctions or error
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gavel className="w-8 h-8 text-emerald-600" />
            <h2 className="text-gray-900">Live Auctions</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bid on unique Pakistani handcrafted items. Each piece tells a story of tradition and craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.map((auction) => {
            const primaryImage = auction.product.images.find(img => img.is_primary) || auction.product.images[0];

            return (
              <Card 
                key={auction.id} 
                className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/auctions/${auction.id}`)}
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={primaryImage?.image_url || '/placeholder-image.jpg'}
                    alt={auction.product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-emerald-600 shadow-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                  {auction.product.seller_profile?.is_verified && (
                    <Badge className="absolute top-3 left-3 bg-blue-600 shadow-lg">
                      Verified Seller
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2">{auction.product.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    by {auction.product.seller_profile?.brand_name || auction.product.seller_username}
                  </p>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-emerald-50 rounded-lg">
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

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${getTimeColor(auction.time_remaining)}`} />
                      <span className={`text-sm ${getTimeColor(auction.time_remaining)}`}>
                        {formatTimeRemaining(auction.time_remaining)} left
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{auction.total_bids} bids</span>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => onAuctionClick?.(auction.id.toString())}
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            onClick={onViewAllAuctions}
          >
            View All Auctions
          </Button>
        </div>
      </div>
    </section>
  );
}