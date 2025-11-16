import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useSeller } from '../../contexts/SellerContext';
import { Gavel, Clock, TrendingUp, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const SellerAuctions: React.FC = () => {
  const { auctions, deleteAuction } = useSeller();
  
  const [deletingAuctionId, setDeletingAuctionId] = useState<number | null>(null);

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-emerald-800">Auction Products</h1>
        <p className="text-gray-600 mt-2">View and manage your auction listings</p>
      </div>

      {auctions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gavel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No auctions yet. Create your first auction!</p>
            <p className="text-sm text-gray-400">Go to "Add Product" and select "Auction" to create an auction listing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {auctions.map((auction: any) => (
            <Card key={auction.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                    <img
                      src={auction.product.images[0]?.image_url || auction.product.images[0]?.image}
                      alt={auction.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-emerald-800 mb-1">{auction.product.name}</h3>
                        <Badge variant={auction.status === 'active' ? 'default' : 'secondary'} className={auction.status === 'active' ? 'bg-emerald-600' : ''}>
                          {auction.status === 'active' ? 'Active' : 'Ended'}
                        </Badge>
                      </div>
                      {auction.status === 'active' && auction.latest_bids.length === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingAuctionId(auction.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Base Price</p>
                        <p className="text-emerald-700">Rs {auction.starting_price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Bid</p>
                        <p className="text-emerald-700">
                          Rs {auction.current_price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Bids</p>
                        <p className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          {auction.total_bids}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time Remaining</p>
                        <p className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          {formatTimeRemaining(new Date(auction.end_time).getTime())}
                        </p>
                      </div>
                    </div>

                    {auction.status === 'ended' && auction.winner_username && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-emerald-900">Auction Winner</p>
                            <p className="text-sm mt-1">
                              <span className="text-gray-600">Winner: </span>
                              <span className="text-emerald-700 font-medium">{auction.winner_username}</span>
                            </p>
                            {auction.winner_email && (
                              <p className="text-sm text-gray-600">
                                <span>Email: </span>
                                <span className="text-gray-700">{auction.winner_email}</span>
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              <span>Winning Bid: </span>
                              <span className="text-emerald-700 font-semibold">Rs {auction.winning_bid_amount || auction.current_price}</span>
                            </p>
                          </div>
                        </div>
                        {auction.order_info && (
                          <div className="mt-3 pt-3 border-t border-emerald-200">
                            <p className="text-xs font-medium text-emerald-900 mb-1">Order Information</p>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600">
                                <span>Order #: </span>
                                <span className="text-gray-700 font-mono">{auction.order_info.order_number}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                <span>Status: </span>
                                <Badge className={
                                  auction.order_info.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  auction.order_info.status === 'paid' ? 'bg-green-100 text-green-700' :
                                  'bg-amber-100 text-amber-700'
                                }>
                                  {auction.order_info.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </p>
                              <p className="text-xs text-gray-600">
                                <span>Your Earnings: </span>
                                <span className="text-emerald-700 font-semibold">Rs {auction.order_info.seller_amount}</span>
                                <span className="text-gray-500"> (after 2% platform fee)</span>
                              </p>
                              {auction.order_info.status === 'pending_payment' && auction.order_info.payment_url && (
                                <p className="text-xs text-amber-600 mt-2">
                                  ⏳ Awaiting payment from winner
                                </p>
                              )}
                              {auction.order_info.shipping_address && auction.order_info.status !== 'pending_payment' && (
                                <div className="mt-2 pt-2 border-t border-emerald-200">
                                  <p className="text-xs font-medium text-emerald-900 mb-1">Shipping Address:</p>
                                  <p className="text-xs text-gray-700">
                                    {auction.order_info.shipping_address.street_address}<br/>
                                    {auction.order_info.shipping_address.city_name}, {auction.order_info.shipping_address.province_name}<br/>
                                    {auction.order_info.shipping_address.postal_code}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {auction.status === 'ended' && !auction.winner_username && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Auction ended with no bids
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAuctionId} onOpenChange={() => setDeletingAuctionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Auction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this auction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingAuctionId) {
                  try {
                    await deleteAuction(deletingAuctionId);
                    setDeletingAuctionId(null);
                  } catch (error) {
                    console.error('Error deleting auction:', error);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerAuctions;
