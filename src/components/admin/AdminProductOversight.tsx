import { useState } from "react";
import { Package, Search, CheckCircle, XCircle, Star as StarIcon, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: string;
  status: "pending" | "approved" | "rejected" | "featured";
  image: string;
  submittedDate: string;
  reports: number;
}

export function AdminProductOversight() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionDialog, setActionDialog] = useState<"approve" | "reject" | "feature" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "P001",
      name: "Hand-Embroidered Shawl",
      seller: "Fatima Textile Co.",
      category: "Textiles & Fabrics",
      price: "PKR 8,500",
      status: "approved",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
      submittedDate: "2025-09-15",
      reports: 0,
    },
    {
      id: "P002",
      name: "Traditional Brass Vase",
      seller: "Karachi Crafts",
      category: "Metalwork & Brass",
      price: "PKR 4,200",
      status: "featured",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
      submittedDate: "2025-08-20",
      reports: 0,
    },
    {
      id: "P003",
      name: "Handwoven Carpet",
      seller: "Heritage Pottery",
      category: "Carpets & Rugs",
      price: "PKR 45,000",
      status: "pending",
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
      submittedDate: "2025-10-22",
      reports: 0,
    },
    {
      id: "P004",
      name: "Silver Jewelry Set",
      seller: "Lahore Jewelry House",
      category: "Handcrafted Jewelry",
      price: "PKR 12,500",
      status: "pending",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      submittedDate: "2025-10-23",
      reports: 0,
    },
    {
      id: "P005",
      name: "Ceramic Pottery Bowl",
      seller: "Heritage Pottery",
      category: "Traditional Pottery",
      price: "PKR 2,800",
      status: "approved",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
      submittedDate: "2025-09-30",
      reports: 0,
    },
    {
      id: "P006",
      name: "Suspicious Product",
      seller: "Unknown Seller",
      category: "Unknown",
      price: "PKR 100",
      status: "rejected",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      submittedDate: "2025-10-20",
      reports: 5,
    },
  ]);

  const pendingProducts = products.filter((p) => p.status === "pending");
  const approvedProducts = products.filter((p) => p.status === "approved");
  const featuredProducts = products.filter((p) => p.status === "featured");
  const rejectedProducts = products.filter((p) => p.status === "rejected");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      case "featured":
        return <Badge className="bg-purple-100 text-purple-700">Featured</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAction = (action: "approve" | "reject" | "feature", product: Product) => {
    setSelectedProduct(product);
    setActionDialog(action);
  };

  const confirmAction = () => {
    if (!selectedProduct || !actionDialog) return;

    let message = "";
    switch (actionDialog) {
      case "approve":
        message = `${selectedProduct.name} approved! It's now live on MadeInPK.`;
        break;
      case "reject":
        if (!rejectionReason.trim()) {
          toast.error("Please provide a rejection reason");
          return;
        }
        message = `${selectedProduct.name} rejected. Seller will be notified.`;
        break;
      case "feature":
        message = `${selectedProduct.name} featured! It will appear in "Editor's Choice".`;
        break;
    }

    toast.success(message);
    setActionDialog(null);
    setSelectedProduct(null);
    setRejectionReason("");
  };

  const renderProductTable = (productList: Product[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reports</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productList.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="text-emerald-700">{product.id}</TableCell>
            <TableCell>
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell className="text-gray-600">{product.seller}</TableCell>
            <TableCell className="text-gray-600">{product.category}</TableCell>
            <TableCell className="text-emerald-700">{product.price}</TableCell>
            <TableCell>{getStatusBadge(product.status)}</TableCell>
            <TableCell>
              {product.reports > 0 ? (
                <Badge className="bg-red-100 text-red-700">{product.reports}</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">0</Badge>
              )}
            </TableCell>
            <TableCell className="text-gray-600">{product.submittedDate}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {product.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction("approve", product)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction("reject", product)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {(product.status === "approved" || product.status === "featured") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("feature", product)}
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <StarIcon className="h-4 w-4 mr-1" />
                    {product.status === "featured" ? "Unfeature" : "Feature"}
                  </Button>
                )}
                {product.reports > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-600 text-yellow-600"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <Package className="h-8 w-8" />
          Product Oversight
        </h2>
        <p className="text-gray-600 mt-1">
          Review, approve, and feature products on MadeInPK
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <h3 className="text-yellow-600 mt-1">{pendingProducts.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved Products</p>
                <h3 className="text-emerald-700 mt-1">{approvedProducts.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Featured Products</p>
                <h3 className="text-purple-700 mt-1">{featuredProducts.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reported Products</p>
                <h3 className="text-red-600 mt-1">
                  {products.filter((p) => p.reports > 0).length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product name, seller, category, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">Product Listings</CardTitle>
          <CardDescription>Review and manage product submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pending ({pendingProducts.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedProducts.length})
              </TabsTrigger>
              <TabsTrigger value="featured">
                Featured ({featuredProducts.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedProducts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderProductTable(
                searchQuery
                  ? filteredProducts.filter((p) => p.status === "pending")
                  : pendingProducts
              )}
            </TabsContent>

            <TabsContent value="approved">
              {renderProductTable(
                searchQuery
                  ? filteredProducts.filter((p) => p.status === "approved")
                  : approvedProducts
              )}
            </TabsContent>

            <TabsContent value="featured">
              {renderProductTable(
                searchQuery
                  ? filteredProducts.filter((p) => p.status === "featured")
                  : featuredProducts
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {renderProductTable(
                searchQuery
                  ? filteredProducts.filter((p) => p.status === "rejected")
                  : rejectedProducts
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog === "approve" && "Approve Product"}
              {actionDialog === "reject" && "Reject Product"}
              {actionDialog === "feature" && "Feature Product"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog === "approve" &&
                `Approve "${selectedProduct?.name}"? It will be visible to all customers on MadeInPK.`}
              {actionDialog === "reject" &&
                `Reject "${selectedProduct?.name}"? Please provide a reason for rejection.`}
              {actionDialog === "feature" &&
                `Feature "${selectedProduct?.name}" in Editor's Choice section? This will give it premium visibility.`}
            </DialogDescription>
          </DialogHeader>

          {actionDialog === "reject" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Rejection Reason</label>
              <Textarea
                placeholder="Enter reason for rejection (will be sent to seller)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionDialog === "feature"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}