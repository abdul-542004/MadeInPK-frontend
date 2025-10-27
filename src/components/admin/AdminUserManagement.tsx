import { useState } from "react";
import { Users, Search, Shield, Ban, CheckCircle, AlertCircle, UserCog } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "suspended" | "banned";
  verified: boolean;
  joinedDate: string;
  totalOrders: number;
  totalSpent: string;
}

export function AdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<"promote" | "suspend" | "ban" | null>(null);

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "U001",
      name: "Ahmed Khan",
      email: "ahmed.khan@example.com",
      role: "buyer",
      status: "active",
      verified: true,
      joinedDate: "2024-08-15",
      totalOrders: 23,
      totalSpent: "PKR 45,670",
    },
    {
      id: "U002",
      name: "Fatima Textile Co.",
      email: "fatima@textiles.pk",
      role: "seller",
      status: "active",
      verified: true,
      joinedDate: "2024-05-10",
      totalOrders: 156,
      totalSpent: "PKR 0",
    },
    {
      id: "U003",
      name: "Hassan Raza",
      email: "hassan.raza@gmail.com",
      role: "buyer",
      status: "suspended",
      verified: false,
      joinedDate: "2025-01-05",
      totalOrders: 2,
      totalSpent: "PKR 3,400",
    },
    {
      id: "U004",
      name: "Ayesha Malik",
      email: "ayesha.malik@example.com",
      role: "buyer",
      status: "active",
      verified: true,
      joinedDate: "2024-11-20",
      totalOrders: 47,
      totalSpent: "PKR 89,230",
    },
    {
      id: "U005",
      name: "Karachi Crafts",
      email: "info@karachicrafts.pk",
      role: "seller",
      status: "active",
      verified: true,
      joinedDate: "2024-07-03",
      totalOrders: 89,
      totalSpent: "PKR 0",
    },
    {
      id: "U006",
      name: "Suspicious User",
      email: "fake@scam.com",
      role: "buyer",
      status: "banned",
      verified: false,
      joinedDate: "2025-02-10",
      totalOrders: 1,
      totalSpent: "PKR 500",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
      case "seller":
        return <Badge className="bg-blue-100 text-blue-700">Seller</Badge>;
      case "buyer":
        return <Badge className="bg-gray-100 text-gray-700">Buyer</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-700">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-700">Banned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAction = (action: "promote" | "suspend" | "ban", user: User) => {
    setSelectedUser(user);
    setActionDialog(action);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionDialog) return;

    let message = "";
    switch (actionDialog) {
      case "promote":
        message = `${selectedUser.name} promoted to seller successfully`;
        break;
      case "suspend":
        message = `${selectedUser.name} suspended successfully`;
        break;
      case "ban":
        message = `${selectedUser.name} banned successfully`;
        break;
    }

    toast.success(message);
    setActionDialog(null);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <Users className="h-8 w-8" />
          User Management
        </h2>
        <p className="text-gray-600 mt-1">
          View, verify, and manage all user accounts on MadeInPK
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-emerald-700">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.joinedDate}</TableCell>
                  <TableCell>{user.totalOrders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.role === "buyer" && user.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("promote", user)}
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          Promote
                        </Button>
                      )}
                      {user.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("suspend", user)}
                          className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {user.status !== "banned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("ban", user)}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog === "promote" && "Promote to Seller"}
              {actionDialog === "suspend" && "Suspend User"}
              {actionDialog === "ban" && "Ban User"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog === "promote" &&
                `Grant seller access to ${selectedUser?.name}? They will be able to list products on MadeInPK.`}
              {actionDialog === "suspend" &&
                `Temporarily suspend ${selectedUser?.name}'s account? They won't be able to access their account until reinstated.`}
              {actionDialog === "ban" &&
                `Permanently ban ${selectedUser?.name}? This action should only be taken for fraudulent or malicious users.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog === "ban"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionDialog === "suspend"
                  ? "bg-yellow-600 hover:bg-yellow-700"
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