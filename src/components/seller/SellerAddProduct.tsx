import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { useSeller } from "../../contexts/SellerContext";
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
  const { addProduct } = useSeller();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");

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

  const handleImageUpload = () => {
    // Mock image upload
    const mockImage = "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&h=300&fit=crop";
    setImages([...images, mockImage]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !category || !price || !stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    addProduct({
      name: productName,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      image: images[0] || "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&h=300&fit=crop",
      images,
      material,
      origin,
    });

    toast.success("Product added successfully!");
    onSuccess();
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
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
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
              
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Upload up to 4 images. First image will be the main product image.
            </p>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  placeholder="e.g., Cotton, Brass, Clay"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="origin">Origin/City</Label>
                <Input
                  id="origin"
                  placeholder="e.g., Multan, Lahore, Karachi"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-emerald-700 hover:bg-emerald-800"
          >
            Add Product
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