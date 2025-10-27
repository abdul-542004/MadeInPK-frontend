import { useState } from "react";
import { Shield, Activity, UserCog, Key, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";

interface LoginActivity {
  id: string;
  user: string;
  email: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  status: "success" | "failed" | "suspicious";
  timestamp: string;
}

interface AdminRole {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Moderator" | "Content Manager" | "Support";
  status: "active" | "inactive";
  lastActive: string;
  permissions: string[];
}

export function AdminSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // Mock login activities
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([
    {
      id: "LA-001",
      user: "Admin User",
      email: "admin@madeinpk.com",
      role: "Admin",
      ipAddress: "110.39.12.45",
      location: "Karachi, Pakistan",
      device: "Chrome on Windows",
      status: "success",
      timestamp: "2025-10-24 09:30 AM",
    },
    {
      id: "LA-002",
      user: "Ahmed Khan",
      email: "ahmed@example.com",
      role: "Buyer",
      ipAddress: "124.29.215.78",
      location: "Lahore, Pakistan",
      device: "Safari on iPhone",
      status: "success",
      timestamp: "2025-10-24 09:15 AM",
    },
    {
      id: "LA-003",
      user: "Unknown",
      email: "hacker@fake.com",
      role: "N/A",
      ipAddress: "185.220.101.23",
      location: "Unknown",
      device: "Unknown",
      status: "failed",
      timestamp: "2025-10-24 08:45 AM",
    },
    {
      id: "LA-004",
      user: "Suspicious User",
      email: "fake@scam.com",
      role: "Buyer",
      ipAddress: "91.134.128.45",
      location: "Unknown Location",
      device: "Chrome on Linux",
      status: "suspicious",
      timestamp: "2025-10-24 08:30 AM",
    },
    {
      id: "LA-005",
      user: "Fatima Ali",
      email: "fatima@textiles.pk",
      role: "Seller",
      ipAddress: "39.42.77.193",
      location: "Islamabad, Pakistan",
      device: "Firefox on Mac",
      status: "success",
      timestamp: "2025-10-24 08:00 AM",
    },
  ]);

  // Mock admin roles
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([
    {
      id: "ADM-001",
      name: "Admin User",
      email: "admin@madeinpk.com",
      role: "Super Admin",
      status: "active",
      lastActive: "2 minutes ago",
      permissions: ["All Permissions"],
    },
    {
      id: "ADM-002",
      name: "Haris Masood",
      email: "haris@madeinpk.com",
      role: "Super Admin",
      status: "active",
      lastActive: "1 hour ago",
      permissions: ["All Permissions"],
    },
    {
      id: "ADM-003",
      name: "Ali Raza",
      email: "ali@madeinpk.com",
      role: "Moderator",
      status: "active",
      lastActive: "3 hours ago",
      permissions: ["User Management", "Product Oversight", "Reports"],
    },
    {
      id: "ADM-004",
      name: "Sara Ahmed",
      email: "sara@madeinpk.com",
      role: "Content Manager",
      status: "active",
      lastActive: "1 day ago",
      permissions: ["Content Management", "Analytics"],
    },
    {
      id: "ADM-005",
      name: "Former Admin",
      email: "former@madeinpk.com",
      role: "Support",
      status: "inactive",
      lastActive: "30 days ago",
      permissions: ["View Only"],
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      case "suspicious":
        return <Badge className="bg-yellow-100 text-yellow-700">Suspicious</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
        return <Badge className="bg-purple-100 text-purple-700">Super Admin</Badge>;
      case "Moderator":
        return <Badge className="bg-blue-100 text-blue-700">Moderator</Badge>;
      case "Content Manager":
        return <Badge className="bg-green-100 text-green-700">Content Manager</Badge>;
      case "Support":
        return <Badge className="bg-gray-100 text-gray-700">Support</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getAdminStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-700">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <Shield className="h-8 w-8" />
          Security & Access Control
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor security activities and manage admin access
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Admins</p>
                <h3 className="text-emerald-700 mt-1">
                  {adminRoles.filter((a) => a.status === "active").length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <UserCog className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Failed Logins (24h)</p>
                <h3 className="text-red-600 mt-1">
                  {loginActivities.filter((l) => l.status === "failed").length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Suspicious Activity</p>
                <h3 className="text-yellow-600 mt-1">
                  {loginActivities.filter((l) => l.status === "suspicious").length}
                </h3>
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
                <p className="text-gray-600 text-sm">2FA Enabled</p>
                <h3 className="text-green-600 mt-1">
                  {twoFactorEnabled ? "Active" : "Disabled"}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="activity">Login Activity</TabsTrigger>
          <TabsTrigger value="admins">Admin Roles</TabsTrigger>
        </TabsList>

        {/* Security Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Platform Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-50">
                      <Key className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      setTwoFactorEnabled(checked);
                      toast.success(
                        checked ? "2FA enabled for all admins" : "2FA disabled"
                      );
                    }}
                  />
                </div>

                {/* Login Alerts */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">Login Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Send email alerts for new login locations
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={loginAlertsEnabled}
                    onCheckedChange={(checked) => {
                      setLoginAlertsEnabled(checked);
                      toast.success(
                        checked ? "Login alerts enabled" : "Login alerts disabled"
                      );
                    }}
                  />
                </div>

                {/* Session Timeout */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-50">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">Session Timeout</h3>
                      <p className="text-sm text-gray-600">
                        Auto-logout after 30 minutes of inactivity
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>

                {/* IP Whitelist */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-50">
                      <Shield className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">IP Whitelist</h3>
                      <p className="text-sm text-gray-600">
                        Restrict admin access to specific IP addresses
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-emerald-600 text-emerald-600">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Recent Login Activity</CardTitle>
              <CardDescription>Monitor all login attempts and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell className="text-gray-600">{activity.email}</TableCell>
                      <TableCell className="text-gray-600">{activity.role}</TableCell>
                      <TableCell className="text-gray-600">{activity.ipAddress}</TableCell>
                      <TableCell className="text-gray-600">{activity.location}</TableCell>
                      <TableCell className="text-gray-600">{activity.device}</TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell className="text-gray-600">{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Roles Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-700">Admin Roles & Permissions</CardTitle>
                  <CardDescription>Manage admin users and their access levels</CardDescription>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <UserCog className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminRoles.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell className="text-gray-600">{admin.email}</TableCell>
                      <TableCell>{getRoleBadge(admin.role)}</TableCell>
                      <TableCell>{getAdminStatusBadge(admin.status)}</TableCell>
                      <TableCell className="text-gray-600">{admin.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.slice(0, 2).map((perm, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {admin.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{admin.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                            Edit
                          </Button>
                          {admin.status === "active" && (
                            <Button size="sm" variant="outline" className="border-red-600 text-red-600">
                              Deactivate
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
        </TabsContent>
      </Tabs>
    </div>
  );
}