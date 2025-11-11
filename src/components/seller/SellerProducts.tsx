import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
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
import { useSeller, SellerProduct } from "../../contexts/SellerContext";
import { productService } from "../../services/productService";
import { MOCK_MODE } from "../../lib/mockMode";
import { useAuth } from "../../contexts/AuthContext";

interface SellerProductsProps {
  onAddProduct: () => void;
}

export function SellerProducts({ onAddProduct }: SellerProductsProps) {
  const { user } = useAuth();
  const { products: contextProducts, updateProduct, deleteProduct } = useSeller();
  const [products, setProducts] = useState<SellerProduct[]>(contextProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (MOCK_MODE || !user) {
      // Use mock data from context
      setProducts(contextProducts);
      setLoading(false);
      return;
    }

    // Backend mode
    try {
      setLoading(true);
      const response = await productService.getProducts({ seller: user.id });
      // Map backend products to SellerProduct format if needed
      const mappedProducts = response.results.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: parseFloat(p.listing_type === 'auction' ? '0' : '0'), // Would need price from listing
        stock: 0, // Would need stock from listing
        status: p.images.length > 0 ? 'Active' : 'Draft',
        category: p.category_name,
        image: p.images[0]?.image_url || '',
      }));
      setProducts(mappedProducts as any);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error(error.response?.data?.message || 'Failed to load products');
      // Fallback to context products
      setProducts(contextProducts);
    } finally {
      setLoading(false);
    }
  };
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<SellerProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleDelete = async (id: string) => {
    if (MOCK_MODE) {
      deleteProduct(id);
      toast.success("Product deleted successfully!");
    } else {
      // Backend mode - delete via API and refresh
      try {
        await productService.deleteProduct(Number(id));
        toast.success("Product deleted successfully!");
        // Refresh the products list
        await loadProducts();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
    setDeletingProductId(null);
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditDescription(product.description || "");
  };

  const handleView = (product: SellerProduct) => {
    setViewingProduct(product);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    if (!editName || !editPrice || !editStock) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateProduct(editingProduct.id, {
      name: editName,
      price: Number(editPrice),
      stock: Number(editStock),
      description: editDescription,
    });

    toast.success("Product updated successfully!");
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">My Products</h1>
          <p className="text-gray-600">Manage your product listings</p>
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
          <CardTitle className="text-gray-900">All Products ({filteredProducts.length})</CardTitle>
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
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-sm text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">PKR {product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{product.sales}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${product.statusColor}`}>{product.status}</Badge>
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
              />
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
              />
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
                src={viewingProduct.image}
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
                  <p className="text-gray-900">{viewingProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-gray-900">PKR {viewingProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="text-gray-900">{viewingProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sales</p>
                  <p className="text-gray-900">{viewingProduct.sales}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={viewingProduct.statusColor}>{viewingProduct.status}</Badge>
                </div>
                {viewingProduct.material && (
                  <div>
                    <p className="text-sm text-gray-600">Material</p>
                    <p className="text-gray-900">{viewingProduct.material}</p>
                  </div>
                )}
                {viewingProduct.origin && (
                  <div>
                    <p className="text-sm text-gray-600">Origin</p>
                    <p className="text-gray-900">{viewingProduct.origin}</p>
                  </div>
                )}
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
