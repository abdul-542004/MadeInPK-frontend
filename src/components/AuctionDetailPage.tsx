import React, { useState, useEffect } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ArrowLeft, Gavel, Clock, TrendingUp, User, Trophy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AuctionDetailPageProps {
  auctionId: string;
  onBack: () => void;
}

const AuctionDetailPage: React.FC<AuctionDetailPageProps> = ({ auctionId, onBack }) => {
  const { getAuction, placeBid } = useAuction();
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(getAuction(auctionId || ''));
  const [bidAmount, setBidAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [, setTick] = useState(0);

  // Update auction data and countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAuction = getAuction(auctionId || '');
      
      // Check if auction just ended and user is the winner
      if (
        auction?.status === 'active' && 
        updatedAuction?.status === 'ended' &&
        updatedAuction.winnerId === user?.email
      ) {
        setShowWinnerDialog(true);
      }
      
      setAuction(updatedAuction);
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [auctionId, auction?.status, user?.email, getAuction]);

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-gray-700 mb-2">Auction Not Found</h2>
            <p className="text-gray-500 mb-6">This auction doesn't exist or has been removed.</p>
            <Button onClick={onBack} className="bg-emerald-600 hover:bg-emerald-700">
              Back to Auctions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return { text: 'Auction Ended', percent: 100 };
    
    const totalDuration = endTime - auction.startTime;
    const percent = ((totalDuration - remaining) / totalDuration) * 100;
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    let text = '';
    if (days > 0) text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    else if (hours > 0) text = `${hours}h ${minutes}m ${seconds}s`;
    else text = `${minutes}m ${seconds}s`;
    
    return { text, percent };
  };

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (placeBid(auction.id, amount)) {
      setBidAmount('');
    }
  };

  const timeRemaining = formatTimeRemaining(auction.endTime);
  const isActive = auction.status === 'active';
  const isOwner = user?.email === auction.sellerId;
  const hasUserBid = auction.bids.some(b => b.bidderId === user?.email);
  const userHighestBid = hasUserBid 
    ? Math.max(...auction.bids.filter(b => b.bidderId === user?.email).map(b => b.amount))
    : 0;
  const isWinning = auction.currentBid === userHighestBid && hasUserBid;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Auctions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={auction.images[selectedImage]}
                  alt={auction.productName}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            
            {auction.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {auction.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex gap-2">
              <Badge className={isActive ? 'bg-emerald-600' : 'bg-gray-600'}>
                {isActive ? 'Live Auction' : 'Auction Ended'}
              </Badge>
              {isWinning && isActive && (
                <Badge className="bg-amber-500">
                  <Trophy className="w-3 h-3 mr-1" />
                  You're Winning!
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-emerald-800 mb-2">{auction.productName}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                by {auction.sellerName}
              </p>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-800">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-line">{auction.description}</p>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Base Price</p>
                    <p className="text-emerald-800 text-2xl">Rs {auction.basePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Current Highest Bid
                    </p>
                    <p className="text-emerald-800 text-2xl">Rs {auction.currentBid}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <p className="text-sm text-gray-600">Total Bids: {auction.bids.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timer */}
            <Card className={isActive ? 'border-emerald-300' : 'border-gray-300'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className={`${isActive ? 'text-emerald-800' : 'text-gray-700'}`}>
                      {isActive ? 'Time Remaining' : 'Auction Ended'}
                    </span>
                  </div>
                  <span className={`${isActive ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {timeRemaining.text}
                  </span>
                </div>
                <Progress value={timeRemaining.percent} className="h-2" />
              </CardContent>
            </Card>

            {/* Bidding Section */}
            {isActive && !isOwner && (
              <Card className="border-emerald-300 shadow-lg bg-gradient-to-br from-white to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Place Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasUserBid && (
                    <Alert className="bg-emerald-50 border-emerald-200">
                      <AlertDescription>
                        Your highest bid: Rs {userHighestBid}
                        {isWinning && ' - You are currently winning! 🎉'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!user && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertDescription className="text-amber-800">
                        Please login to place a bid on this auction
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder={`Enter amount (Min: Rs ${auction.currentBid + 1})`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          min={auction.currentBid + 1}
                          className="text-lg h-12"
                          disabled={!user}
                        />
                      </div>
                      <Button 
                        onClick={handlePlaceBid}
                        className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12"
                        disabled={!user}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Place Bid
                      </Button>
                    </div>
                    
                    {/* Quick Bid Buttons */}
                    {user && (
                      <div className="flex gap-2">
                        <p className="text-sm text-gray-600 flex items-center">Quick bid:</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount(String(auction.currentBid + 100))}
                          className="text-xs"
                        >
                          +Rs 100
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount(String(auction.currentBid + 500))}
                          className="text-xs"
                        >
                          +Rs 500
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount(String(auction.currentBid + 1000))}
                          className="text-xs"
                        >
                          +Rs 1000
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Message */}
            {isActive && isOwner && (
              <Card className="border-blue-300 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Gavel className="w-6 h-6 text-blue-600" />
                    <h3 className="text-blue-800">Your Auction</h3>
                  </div>
                  <p className="text-gray-700">
                    This is your auction listing. You cannot bid on your own products.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Current status: {auction.bids.length} bid(s) • Highest: Rs {auction.currentBid}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ended Auction Winner */}
            {!isActive && auction.winnerName && (
              <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-amber-600" />
                    <h3 className="text-amber-800">Auction Winner</h3>
                  </div>
                  <p className="text-gray-700">{auction.winnerName}</p>
                  <p className="text-amber-700">Winning Bid: Rs {auction.currentBid}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Bids */}
            {auction.bids.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-800">Recent Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {auction.bids.map((bid) => (
                      <div 
                        key={bid.id} 
                        className={`flex justify-between items-center p-3 rounded-lg ${
                          bid.bidderId === user?.email ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{bid.bidderName}</span>
                          {bid.bidderId === user?.email && (
                            <Badge className="bg-emerald-600 text-xs">You</Badge>
                          )}
                        </div>
                        <span className="text-emerald-700">Rs {bid.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Winner Congratulations Dialog */}
      <AlertDialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl text-emerald-800">
              🎉 Congratulations!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p className="text-lg">You've won the auction!</p>
              <div className="bg-emerald-50 p-4 rounded-lg my-4">
                <p className="text-emerald-800 mb-1">{auction.productName}</p>
                <p className="text-emerald-700">Winning Bid: Rs {auction.currentBid}</p>
              </div>
              <p className="text-sm text-gray-600">
                The seller will contact you shortly with payment and delivery details.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full bg-emerald-600 hover:bg-emerald-700">
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AuctionDetailPage;
