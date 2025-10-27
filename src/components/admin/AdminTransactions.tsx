import { useState } from "react";
import { DollarSign, Search, Download, TrendingUp, CreditCard } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function AdminTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock transactions data
  const transactions = [
    {
      id: "TXN-001",
      orderId: "ORD-1234",
      buyer: "Ahmed Khan",
      seller: "Fatima Textile Co.",
      amount: "PKR 15,500",
      commission: "PKR 1,550",
      sellerPayout: "PKR 13,950",
      status: "completed",
      date: "2025-10-20",
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN-002",
      orderId: "ORD-1235",
      buyer: "Ayesha Malik",
      seller: "Karachi Crafts",
      amount: "PKR 8,900",
      commission: "PKR 890",
      sellerPayout: "PKR 8,010",
      status: "completed",
      date: "2025-10-21",
      paymentMethod: "JazzCash",
    },
    {
      id: "TXN-003",
      orderId: "ORD-1236",
      buyer: "Hassan Raza",
      seller: "Golden Carpets",
      amount: "PKR 45,000",
      commission: "PKR 4,500",
      sellerPayout: "PKR 40,500",
      status: "pending",
      date: "2025-10-22",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "TXN-004",
      orderId: "ORD-1237",
      buyer: "Zainab Ali",
      seller: "Heritage Pottery",
      amount: "PKR 12,700",
      commission: "PKR 1,270",
      sellerPayout: "PKR 11,430",
      status: "dispute",
      date: "2025-10-22",
      paymentMethod: "Easypaisa",
    },
    {
      id: "TXN-005",
      orderId: "ORD-1238",
      buyer: "Ali Akbar",
      seller: "Lahore Jewelry House",
      amount: "PKR 22,300",
      commission: "PKR 2,230",
      sellerPayout: "PKR 20,070",
      status: "refunded",
      date: "2025-10-23",
      paymentMethod: "Credit Card",
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || txn.status === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "dispute":
        return <Badge className="bg-red-100 text-red-700">Dispute</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-700">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate stats
  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^\d]/g, "")), 0);

  const totalCommission = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.commission.replace(/[^\d]/g, "")), 0);

  const pendingPayouts = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + parseInt(t.sellerPayout.replace(/[^\d]/g, "")), 0);

  const disputes = transactions.filter((t) => t.status === "dispute").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <DollarSign className="h-8 w-8" />
          Transactions & Payments
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor all payment activities and manage seller payouts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <h3 className="text-emerald-700 mt-1">PKR {totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Commission</p>
                <h3 className="text-blue-700 mt-1">PKR {totalCommission.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payouts</p>
                <h3 className="text-yellow-700 mt-1">PKR {pendingPayouts.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Disputes</p>
                <h3 className="text-red-700 mt-1">{disputes}</h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by transaction ID, order ID, buyer, or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispute">Disputes</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-emerald-700">All Transactions</CardTitle>
              <CardDescription>Complete payment history and records</CardDescription>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission (10%)</TableHead>
                <TableHead>Seller Payout</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="text-emerald-700">{txn.id}</TableCell>
                  <TableCell className="text-blue-700">{txn.orderId}</TableCell>
                  <TableCell>{txn.buyer}</TableCell>
                  <TableCell className="text-gray-600">{txn.seller}</TableCell>
                  <TableCell className="text-emerald-700">{txn.amount}</TableCell>
                  <TableCell className="text-blue-700">{txn.commission}</TableCell>
                  <TableCell className="text-gray-900">{txn.sellerPayout}</TableCell>
                  <TableCell className="text-gray-600">{txn.paymentMethod}</TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  <TableCell className="text-gray-600">{txn.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {txn.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Process Payout
                        </Button>
                      )}
                      {txn.status === "dispute" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600"
                        >
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-300">
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
