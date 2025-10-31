import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuction } from '../../contexts/AuctionContext';
import { Gavel, Clock, TrendingUp, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const SellerAuctions: React.FC = () => {
  const { myAuctions, createAuction, deleteAuction } = useAuction();
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    basePrice: '',
    duration: '24 hours',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.description || !formData.basePrice) {
      toast.error('Please fill all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    createAuction({
      productName: formData.productName,
      description: formData.description,
      images: images,
      basePrice: parseFloat(formData.basePrice),
      duration: formData.duration,
    });

    // Reset form
    setFormData({
      productName: '',
      description: '',
      basePrice: '',
      duration: '24 hours',
    });
    setImages([]);
  };

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
        <p className="text-gray-600 mt-2">Manage your auction listings and create new auctions</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-emerald-50">
          <TabsTrigger value="active" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
            Active Auctions
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
            Create Auction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {myAuctions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Gavel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No auctions yet. Create your first auction!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myAuctions.map((auction) => (
                <Card key={auction.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                        <img
                          src={auction.images[0]}
                          alt={auction.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-emerald-800 mb-1">{auction.productName}</h3>
                            <Badge variant={auction.status === 'active' ? 'default' : 'secondary'} className={auction.status === 'active' ? 'bg-emerald-600' : ''}>
                              {auction.status === 'active' ? 'Active' : 'Ended'}
                            </Badge>
                          </div>
                          {auction.status === 'active' && auction.bids.length === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAuction(auction.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Base Price</p>
                            <p className="text-emerald-700">Rs {auction.basePrice}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current Bid</p>
                            <p className="text-emerald-700">
                              Rs {auction.currentBid}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Bids</p>
                            <p className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                              {auction.bids.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time Remaining</p>
                            <p className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-emerald-600" />
                              {formatTimeRemaining(auction.endTime)}
                            </p>
                          </div>
                        </div>

                        {auction.status === 'ended' && auction.winnerName && (
                          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm">
                              <span className="text-gray-600">Winner: </span>
                              <span className="text-emerald-700">{auction.winnerName}</span>
                              <span className="text-gray-600"> - Rs {auction.currentBid}</span>
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
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Create New Auction</CardTitle>
              <CardDescription>
                List a unique product for auction. Each auction product has a quantity of 1.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Title *</Label>
                  <Input
                    id="productName"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Images *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                    />
                    <Button type="button" onClick={handleAddImage} className="bg-emerald-600 hover:bg-emerald-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price (Rs) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      placeholder="Starting price"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Auction Duration *</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12 hours">12 hours</SelectItem>
                        <SelectItem value="24 hours">24 hours</SelectItem>
                        <SelectItem value="2 days">2 days</SelectItem>
                        <SelectItem value="3 days">3 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Gavel className="w-4 h-4 mr-2" />
                    Start Auction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAuctions;
