import { useState } from "react";
import { Store, Search, CheckCircle, XCircle, Star, AlertTriangle } from "lucide-react";
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
import { toast } from "sonner";

interface Seller {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  rating: number;
  totalProducts: number;
  totalSales: string;
  registeredDate: string;
  complaints: number;
  category: string;
}

export function AdminSellerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [actionDialog, setActionDialog] = useState<"approve" | "reject" | null>(null);

  // Mock sellers data
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: "S001",
      businessName: "Fatima Textile Co.",
      ownerName: "Fatima Ali",
      email: "fatima@textiles.pk",
      phone: "+92 300 1234567",
      status: "approved",
      rating: 4.8,
      totalProducts: 45,
      totalSales: "PKR 2,345,678",
      registeredDate: "2024-05-10",
      complaints: 0,
      category: "Textiles & Fabrics",
    },
    {
      id: "S002",
      businessName: "Karachi Crafts",
      ownerName: "Ahmed Hussain",
      email: "info@karachicrafts.pk",
      phone: "+92 321 9876543",
      status: "approved",
      rating: 4.6,
      totalProducts: 32,
      totalSales: "PKR 1,876,543",
      registeredDate: "2024-07-03",
      complaints: 2,
      category: "Handcrafted Items",
    },
    {
      id: "S003",
      businessName: "Heritage Pottery",
      ownerName: "Saira Khan",
      email: "saira@heritagepottery.pk",
      phone: "+92 333 5551234",
      status: "pending",
      rating: 0,
      totalProducts: 0,
      totalSales: "PKR 0",
      registeredDate: "2025-10-20",
      complaints: 0,
      category: "Traditional Pottery",
    },
    {
      id: "S004",
      businessName: "Lahore Jewelry House",
      ownerName: "Zainab Malik",
      email: "zainab@lahorejewelry.pk",
      phone: "+92 300 7778888",
      status: "pending",
      rating: 0,
      totalProducts: 0,
      totalSales: "PKR 0",
      registeredDate: "2025-10-22",
      complaints: 0,
      category: "Handcrafted Jewelry",
    },
    {
      id: "S005",
      businessName: "Golden Carpets",
      ownerName: "Rashid Ahmed",
      email: "rashid@goldencarpets.pk",
      phone: "+92 311 2223344",
      status: "approved",
      rating: 4.9,
      totalProducts: 28,
      totalSales: "PKR 3,456,789",
      registeredDate: "2024-04-15",
      complaints: 0,
      category: "Carpets & Rugs",
    },
    {
      id: "S006",
      businessName: "Suspicious Seller",
      ownerName: "Unknown",
      email: "fake@seller.com",
      phone: "+92 300 0000000",
      status: "rejected",
      rating: 0,
      totalProducts: 0,
      totalSales: "PKR 0",
      registeredDate: "2025-10-15",
      complaints: 5,
      category: "Unknown",
    },
  ]);

  const pendingSellers = sellers.filter((s) => s.status === "pending");
  const approvedSellers = sellers.filter((s) => s.status === "approved");
  const rejectedSellers = sellers.filter((s) => s.status === "rejected");

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchQuery.toLowerCase());
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
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAction = (action: "approve" | "reject", seller: Seller) => {
    setSelectedSeller(seller);
    setActionDialog(action);
  };

  const confirmAction = () => {
    if (!selectedSeller || !actionDialog) return;

    const message =
      actionDialog === "approve"
        ? `${selectedSeller.businessName} approved successfully! They can now list products.`
        : `${selectedSeller.businessName} has been rejected.`;

    toast.success(message);
    setActionDialog(null);
    setSelectedSeller(null);
  };

  const renderSellerTable = (sellerList: Seller[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Seller ID</TableHead>
          <TableHead>Business Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Total Sales</TableHead>
          <TableHead>Complaints</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sellerList.map((seller) => (
          <TableRow key={seller.id}>
            <TableCell className="text-emerald-700">{seller.id}</TableCell>
            <TableCell>{seller.businessName}</TableCell>
            <TableCell className="text-gray-600">{seller.ownerName}</TableCell>
            <TableCell className="text-gray-600">{seller.category}</TableCell>
            <TableCell>{getStatusBadge(seller.status)}</TableCell>
            <TableCell>
              {seller.rating > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </TableCell>
            <TableCell>{seller.totalProducts}</TableCell>
            <TableCell className="text-emerald-700">{seller.totalSales}</TableCell>
            <TableCell>
              {seller.complaints > 0 ? (
                <Badge className="bg-red-100 text-red-700">
                  {seller.complaints}
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">0</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {seller.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction("approve", seller)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction("reject", seller)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {seller.status === "approved" && (
                  <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                    View Details
                  </Button>
                )}
                {seller.complaints > 0 && (
                  <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
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
          <Store className="h-8 w-8" />
          Seller Management
        </h2>
        <p className="text-gray-600 mt-1">
          Approve new sellers and monitor seller performance on MadeInPK
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approvals</p>
                <h3 className="text-yellow-600 mt-1">{pendingSellers.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Sellers</p>
                <h3 className="text-emerald-700 mt-1">{approvedSellers.length}</h3>
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
                <p className="text-gray-600 text-sm">Total Products</p>
                <h3 className="text-gray-900 mt-1">
                  {approvedSellers.reduce((sum, s) => sum + s.totalProducts, 0)}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Complaints</p>
                <h3 className="text-red-600 mt-1">
                  {sellers.reduce((sum, s) => sum + s.complaints, 0)}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
              placeholder="Search by business name, owner, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sellers Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">Seller Applications</CardTitle>
          <CardDescription>Review and manage seller registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingSellers.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedSellers.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedSellers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderSellerTable(
                searchQuery
                  ? filteredSellers.filter((s) => s.status === "pending")
                  : pendingSellers
              )}
            </TabsContent>

            <TabsContent value="approved">
              {renderSellerTable(
                searchQuery
                  ? filteredSellers.filter((s) => s.status === "approved")
                  : approvedSellers
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {renderSellerTable(
                searchQuery
                  ? filteredSellers.filter((s) => s.status === "rejected")
                  : rejectedSellers
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
              {actionDialog === "approve" ? "Approve Seller" : "Reject Seller"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog === "approve"
                ? `Approve ${selectedSeller?.businessName}? They will be able to list products on MadeInPK.`
                : `Reject ${selectedSeller?.businessName}'s application? This can be reversed later.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
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