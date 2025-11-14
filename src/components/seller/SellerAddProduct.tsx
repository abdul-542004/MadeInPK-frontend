import { useState } from "react";
import { toast } from "sonner";
import { useSeller } from "../../contexts/SellerContext";
import { MOCK_MODE } from "../../lib/mockMode";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronLeft, Upload, X } from "lucide-react";

interface SellerAddProductProps {
  onSuccess: () => void;
}

export function SellerAddProduct({ onSuccess }: SellerAddProductProps) {
  const { addProduct, addAuction } = useSeller();
  const [listingType, setListingType] = useState<'fixed_price' | 'auction'>('fixed_price');
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("new");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("24 hours");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Discount fields for fixed-price listings
  const [featured, setFeatured] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");

  const categories = [
    "Textiles",
    "Pottery",
    "Jewelry",
    "Metalwork",
    "Carpets",
    "Handicrafts",
    "Home Decor",
    "Traditional Clothing",
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const durations = [
    '24 hours',
    '48 hours',
    '72 hours',
    '1 week'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Limit to 4 images total
    const remainingSlots = 4 - imageFiles.length;
    const filesToAdd = Math.min(files.length, remainingSlots);
    
    for (let i = 0; i < filesToAdd; i++) {
      const file = files[i];
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    
    setImageFiles([...imageFiles, ...newFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (listingType === 'fixed_price') {
        if (!price || !stock) {
          toast.error("Please fill in price and stock for fixed-price listing");
          return;
        }
        
        // Validate discount fields if discount is enabled
        if (hasDiscount) {
          if (!discountPercentage || !discountStartDate || !discountEndDate) {
            toast.error("Please fill in all discount fields");
            return;
          }
          if (parseFloat(discountPercentage) <= 0 || parseFloat(discountPercentage) >= 100) {
            toast.error("Discount percentage must be between 0 and 100");
            return;
          }
        }
        
        await addProduct({
          name: productName,
          category,
          condition,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          images: imageFiles,
          featured,
          discount_percentage: hasDiscount ? parseFloat(discountPercentage) : undefined,
          discount_start_date: hasDiscount ? discountStartDate : undefined,
          discount_end_date: hasDiscount ? discountEndDate : undefined,
        });
      } else {
        // Auction
        if (!startingPrice || !duration) {
          toast.error("Please fill in starting price and duration for auction");
          return;
        }
        
        await addAuction({
          name: productName,
          category,
          condition,
          description,
          starting_price: parseFloat(startingPrice),
          duration,
          images: imageFiles,
        });
      }

      // Navigate back on success
      onSuccess();
    } catch (error) {
      // Error is already handled in the context
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSuccess}
          className="text-gray-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to list your product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing Type Selection */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Listing Type</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setListingType('fixed_price')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  listingType === 'fixed_price'
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Fixed Price</h3>
                <p className="text-sm text-gray-600">Set a fixed price with stock quantity</p>
              </button>
              <button
                type="button"
                onClick={() => setListingType('auction')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  listingType === 'auction'
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Auction</h3>
                <p className="text-sm text-gray-600">List for auction with time limit</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="productName">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="e.g., Hand-Embroidered Shawl"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">
                  Condition <span className="text-red-500">*</span>
                </Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditional Fields based on Listing Type */}
            {listingType === 'fixed_price' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    Price (PKR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingPrice">
                    Starting Price (PKR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    placeholder="0"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">
                    Auction Duration <span className="text-red-500">*</span>
                  </Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((dur) => (
                        <SelectItem key={dur} value={dur}>
                          {dur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product, its features, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {imagePreviews.length < 4 && (
                <label className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Upload up to 4 images. First image will be the main product image.
            </p>
          </CardContent>
        </Card>

        {/* Discount & Featured (Fixed-Price Only) */}
        {listingType === 'fixed_price' && (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Mark as Featured Product
                </Label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasDiscount"
                    checked={hasDiscount}
                    onChange={(e) => setHasDiscount(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
                  />
                  <Label htmlFor="hasDiscount" className="cursor-pointer">
                    Add Discount
                  </Label>
                </div>

                {hasDiscount && (
                  <div className="pl-6 space-y-3 border-l-2 border-gray-200">
                    <div>
                      <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        min="1"
                        max="99"
                        placeholder="e.g., 10"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="discountStartDate">Start Date & Time</Label>
                        <Input
                          id="discountStartDate"
                          type="datetime-local"
                          value={discountStartDate}
                          onChange={(e) => setDiscountStartDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discountEndDate">End Date & Time</Label>
                        <Input
                          id="discountEndDate"
                          type="datetime-local"
                          value={discountEndDate}
                          onChange={(e) => setDiscountEndDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-emerald-700 hover:bg-emerald-800"
          >
            {listingType === 'fixed_price' ? 'Add Fixed-Price Product' : 'Start Auction'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}