import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, MoreVertical, X, Upload, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
import { toast } from "sonner";
import { useSeller } from "../../contexts/SellerContext";
import { SellerProductListing } from "../../types/seller";
import { productService } from "../../services/productService";

interface SellerProductsProps {
  onAddProduct: () => void;
}

// Helper function to get status badge color
const getStatusColor = (status?: string): string => {
  if (!status) return "bg-gray-100 text-gray-700";
  
  switch (status) {
    case 'active':
      return "bg-emerald-100 text-emerald-700";
    case 'inactive':
      return "bg-gray-100 text-gray-700";
    case 'out_of_stock':
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Helper function to get status label
const getStatusLabel = (status?: string): string => {
  if (!status) return "Draft";
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function SellerProducts({ onAddProduct }: SellerProductsProps) {
  const { products, updateProduct, toggleProductStatus, deleteProduct } = useSeller();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<SellerProductListing | null>(null);
  const [viewingProduct, setViewingProduct] = useState<SellerProductListing | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  
  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editHasDiscount, setEditHasDiscount] = useState(false);
  const [editDiscountPercentage, setEditDiscountPercentage] = useState("");
  const [editDiscountStartDate, setEditDiscountStartDate] = useState("");
  const [editDiscountEndDate, setEditDiscountEndDate] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  
  // Image management state
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);

  // Filter to show only fixed-price products
  const fixedPriceProducts = products.filter(p => p.listingType === 'fixed_price' || p.price !== undefined);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      // Error already handled in context
    }
    setDeletingProductId(null);
  };

  const handleToggleStatus = async (listingId: number) => {
    try {
      await toggleProductStatus(listingId);
    } catch (error) {
      // Error already handled in context
    }
  };

  const handleEdit = (product: SellerProductListing) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price || "0");
    setEditStock(String(product.quantity || 0));
    setEditDescription(product.description || "");
    
    // Set discount fields
    const hasDiscount = Boolean(product.discount_percentage);
    setEditHasDiscount(hasDiscount);
    setEditDiscountPercentage(product.discount_percentage || "");
    
    // Format dates for datetime-local input
    if (product.discount_start_date) {
      const startDate = new Date(product.discount_start_date);
      setEditDiscountStartDate(startDate.toISOString().slice(0, 16));
    } else {
      setEditDiscountStartDate("");
    }
    
    if (product.discount_end_date) {
      const endDate = new Date(product.discount_end_date);
      setEditDiscountEndDate(endDate.toISOString().slice(0, 16));
    } else {
      setEditDiscountEndDate("");
    }
    
    // Set featured status
    setEditFeatured(product.featured || false);
    
    // Reset image state
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setDeletingImageIds([]);
  };

  const handleAddNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!editingProduct) return;
    
    const currentImageCount = (editingProduct.images?.length || 0) - deletingImageIds.length;
    const totalImages = currentImageCount + newImageFiles.length + files.length;
    
    if (totalImages > 4) {
      toast.error(`Maximum 4 images allowed. You can add ${4 - currentImageCount - newImageFiles.length} more.`);
      return;
    }
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewImageFiles([...newImageFiles, ...files]);
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleMarkImageForDeletion = (imageId: number) => {
    if (!editingProduct) return;
    
    const remainingImages = (editingProduct.images?.length || 0) - deletingImageIds.length - 1 + newImageFiles.length;
    
    if (remainingImages < 1) {
      toast.error("Product must have at least one image");
      return;
    }
    
    setDeletingImageIds([...deletingImageIds, imageId]);
  };

  const handleUnmarkImageForDeletion = (imageId: number) => {
    setDeletingImageIds(deletingImageIds.filter(id => id !== imageId));
  };

  const handleView = (product: SellerProductListing) => {
    setViewingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct || !editingProduct.listingId) return;
    
    if (!editName || !editPrice || !editStock) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate discount fields if enabled
    if (editHasDiscount) {
      if (!editDiscountPercentage || !editDiscountStartDate || !editDiscountEndDate) {
        toast.error("Please fill in all discount fields or disable discount");
        return;
      }
    }

    try {
      // Update product listing details
      await updateProduct(editingProduct.id, editingProduct.listingId, {
        price: Number(editPrice),
        quantity: Number(editStock),
        discount_percentage: editHasDiscount ? Number(editDiscountPercentage) : null,
        discount_start_date: editHasDiscount ? new Date(editDiscountStartDate).toISOString() : null,
        discount_end_date: editHasDiscount ? new Date(editDiscountEndDate).toISOString() : null,
        featured: editFeatured,
      });
      
      // Delete marked images
      for (const imageId of deletingImageIds) {
        try {
          await productService.deleteProductImage(editingProduct.id, imageId);
        } catch (error) {
          console.error('Error deleting image:', error);
          toast.error('Failed to delete some images');
        }
      }
      
      // Add new images
      for (const imageFile of newImageFiles) {
        try {
          await productService.addProductImage(editingProduct.id, imageFile);
        } catch (error) {
          console.error('Error adding image:', error);
          toast.error('Failed to add some images');
        }
      }
      
      // Clean up preview URLs
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      toast.success("Product updated successfully");
      setEditingProduct(null);
    } catch (error) {
      // Error already handled in context
    }
  };

  const filteredProducts = fixedPriceProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Fixed-Price Products</h1>
          <p className="text-gray-600">Manage your fixed-price product listings</p>
        </div>
        <Button onClick={onAddProduct} className="bg-emerald-700 hover:bg-emerald-800">
          + Add New Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Fixed-Price Listings ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.image_url || "https://via.placeholder.com/48"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{product.name}</span>
                          {product.featured && (
                            <Badge className="w-fit bg-amber-100 text-amber-700 text-xs mt-1">
                              <Star className="h-3 w-3 mr-1 fill-amber-700" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{product.categoryName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        PKR {product.price ? parseFloat(product.price).toLocaleString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{product.quantity || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(product.status)}>{getStatusLabel(product.status)}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(product)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => product.listingId && handleToggleStatus(product.listingId)}
                            disabled={product.status === 'out_of_stock' || !product.listingId}
                          >
                            {product.status === 'active' ? '⏸️' : '▶️'}
                            <span className="ml-2">
                              {product.status === 'active' ? 'Deactivate' : 'Activate'}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingProductId(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Product name cannot be changed</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (PKR)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1 min-h-24"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Description cannot be changed</p>
            </div>

            {/* Discount Options */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="edit-hasDiscount"
                  checked={editHasDiscount}
                  onChange={(e) => setEditHasDiscount(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
                />
                <Label htmlFor="edit-hasDiscount" className="cursor-pointer">
                  Enable Discount
                </Label>
              </div>

              {editHasDiscount && (
                <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                  <div>
                    <Label htmlFor="edit-discountPercentage">Discount Percentage (%)</Label>
                    <Input
                      id="edit-discountPercentage"
                      type="number"
                      min="1"
                      max="99"
                      value={editDiscountPercentage}
                      onChange={(e) => setEditDiscountPercentage(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-discountStartDate">Start Date & Time</Label>
                      <Input
                        id="edit-discountStartDate"
                        type="datetime-local"
                        value={editDiscountStartDate}
                        onChange={(e) => setEditDiscountStartDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-discountEndDate">End Date & Time</Label>
                      <Input
                        id="edit-discountEndDate"
                        type="datetime-local"
                        value={editDiscountEndDate}
                        onChange={(e) => setEditDiscountEndDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Product Option */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
                />
                <Label htmlFor="edit-featured" className="cursor-pointer">
                  Mark as Featured Product
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Featured products get highlighted placement in the marketplace
              </p>
            </div>

            {/* Image Management */}
            <div className="border-t pt-4">
              <Label className="text-base font-semibold mb-3 block">Product Images</Label>
              
              {/* Current Images */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Current Images:</p>
                <div className="grid grid-cols-4 gap-3">
                  {editingProduct?.images?.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt="Product"
                        className={`w-full h-24 object-cover rounded-lg border-2 ${
                          deletingImageIds.includes(image.id)
                            ? 'border-red-500 opacity-50'
                            : 'border-gray-200'
                        }`}
                      />
                      {deletingImageIds.includes(image.id) ? (
                        <button
                          type="button"
                          onClick={() => handleUnmarkImageForDeletion(image.id)}
                          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md hover:bg-green-600"
                          title="Keep this image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMarkImageForDeletion(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete this image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                      {image.is_primary && (
                        <Badge className="absolute bottom-1 left-1 text-xs bg-emerald-700">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* New Images Preview */}
              {newImagePreviews.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">New Images to Add:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-green-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <Badge className="absolute bottom-1 left-1 text-xs bg-green-600">
                          New
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Images Button */}
              {editingProduct && 
                ((editingProduct.images?.length || 0) - deletingImageIds.length + newImageFiles.length < 4) && (
                <div>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                    <Upload className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Add More Images ({4 - ((editingProduct.images?.length || 0) - deletingImageIds.length + newImageFiles.length)} remaining)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddNewImages}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-emerald-700 hover:bg-emerald-800">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-4">
              <img
                src={viewingProduct.images[0]?.image_url || "https://via.placeholder.com/400"}
                alt={viewingProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="text-gray-900">{viewingProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-gray-900">{viewingProduct.categoryName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-gray-900">
                    PKR {viewingProduct.price ? parseFloat(viewingProduct.price).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="text-gray-900">{viewingProduct.quantity || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(viewingProduct.status)}>{getStatusLabel(viewingProduct.status)}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="text-gray-900">{viewingProduct.condition}</p>
                </div>
              </div>
              {viewingProduct.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{viewingProduct.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingProduct(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProductId && handleDelete(deletingProductId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
