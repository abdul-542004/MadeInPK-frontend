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
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800">Auction Products</h1>
        <p className="text-gray-600 mt-2">View and manage your auction listings</p>
      </div>

      {auctions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gavel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 mb-2">No auctions yet. Create your first auction!</p>
            <p className="text-sm text-gray-400">Go to "Add Product" and select "Auction" to create an auction listing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction: any) => (
            <Card key={auction.id}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row min-h-full">
                  {/* Image */}
                  <div className="w-full md:w-48 bg-gray-100 flex-shrink-0">
                    <img
                      src={auction.product.images[0]?.image_url || auction.product.images[0]?.image}
                      alt={auction.product.name}
                      className="w-full h-full object-cover min-h-48 md:min-h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-2">{auction.product.name}</h3>
                        <Badge 
                          variant={auction.status === 'active' ? 'default' : 'secondary'} 
                          className={auction.status === 'active' ? 'bg-emerald-600' : ''}
                        >
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
                        <p className="text-xs text-gray-500 uppercase mb-1">Base Price</p>
                        <p className="text-base font-bold text-emerald-700">Rs {auction.starting_price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Current Bid</p>
                        <p className="text-base font-bold text-emerald-700">
                          Rs {auction.current_price}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Total Bids</p>
                        <p className="flex items-center gap-1 text-base font-bold">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          {auction.total_bids}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Time Remaining</p>
                        <p className="flex items-center gap-1 text-base font-bold">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          {formatTimeRemaining(new Date(auction.end_time).getTime())}
                        </p>
                      </div>
                    </div>

                    {auction.status === 'ended' && auction.winner_username && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="mb-3">
                          <p className="text-sm font-bold text-emerald-900 mb-2">🏆 Auction Winner</p>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-gray-600">Winner: </span>
                              <span className="text-emerald-700 font-bold">{auction.winner_username}</span>
                            </p>
                            {auction.winner_email && (
                              <p className="text-sm">
                                <span className="text-gray-600">Email: </span>
                                <span className="text-gray-700">{auction.winner_email}</span>
                              </p>
                            )}
                            <p className="text-sm">
                              <span className="text-gray-600">Winning Bid: </span>
                              <span className="text-emerald-700 font-bold">Rs {auction.winning_bid_amount || auction.current_price}</span>
                            </p>
                          </div>
                        </div>
                        {auction.order_info && (
                          <div className="mt-3 pt-3 border-t border-emerald-200">
                            <p className="text-sm font-bold text-emerald-900 mb-2">📦 Order Information</p>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-600">Order #: </span>
                                <span className="text-gray-700 font-mono text-xs">{auction.order_info.order_number}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">Status: </span>
                                <Badge className={
                                  auction.order_info.status === 'shipped' ? 'bg-blue-600 text-white' :
                                  auction.order_info.status === 'paid' ? 'bg-green-600 text-white' :
                                  'bg-amber-500 text-white'
                                }>
                                  {auction.order_info.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">Your Earnings: </span>
                                <span className="text-emerald-700 font-bold">Rs {auction.order_info.seller_amount}</span>
                                <span className="text-gray-500 text-xs"> (after 2% fee)</span>
                              </p>
                              {auction.order_info.status === 'pending_payment' && auction.order_info.payment_url && (
                                <div className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded border border-amber-200 mt-2">
                                  ⏳ Awaiting payment from winner
                                </div>
                              )}
                              {auction.order_info.shipping_address && auction.order_info.status !== 'pending_payment' && (
                                <div className="mt-3 pt-3 border-t border-emerald-200">
                                  <p className="text-sm font-bold text-emerald-900 mb-2">📍 Shipping Address</p>
                                  <div className="text-sm text-gray-700 bg-white p-3 rounded border border-emerald-200">
                                    <p>{auction.order_info.shipping_address.street_address}</p>
                                    <p>{auction.order_info.shipping_address.city_name}, {auction.order_info.shipping_address.province_name}</p>
                                    <p>{auction.order_info.shipping_address.postal_code}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {auction.status === 'ended' && !auction.winner_username && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          📭 Auction ended with no bids
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
