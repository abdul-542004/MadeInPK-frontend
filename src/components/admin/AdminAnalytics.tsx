import { 
  DollarSign, 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export function AdminAnalytics() {
  // Mock stats data
  const stats = [
    {
      title: "Total Revenue",
      value: "PKR 12,345,678",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Users",
      value: "8,547",
      change: "+18.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Sellers",
      value: "234",
      change: "+5.4%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Products",
      value: "3,456",
      change: "+23",
      trend: "up",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Orders",
      value: "1,847",
      change: "+8.9%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Approvals",
      value: "47",
      change: "-12%",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const topSellingCategories = [
    { name: "Textiles & Fabrics", sales: "PKR 4,234,567", orders: 523 },
    { name: "Handcrafted Jewelry", sales: "PKR 2,876,543", orders: 412 },
    { name: "Traditional Pottery", sales: "PKR 1,987,654", orders: 289 },
    { name: "Carpets & Rugs", sales: "PKR 1,543,210", orders: 178 },
    { name: "Metalwork & Brass", sales: "PKR 987,654", orders: 145 },
  ];

  const topRegions = [
    { name: "Punjab", percentage: "45%", users: 3846 },
    { name: "Sindh", percentage: "28%", users: 2393 },
    { name: "Khyber Pakhtunkhwa", percentage: "15%", users: 1282 },
    { name: "Balochistan", percentage: "8%", users: 684 },
    { name: "International", percentage: "4%", users: 342 },
  ];

  const recentActivity = [
    { type: "New User", description: "Ahmed Khan registered", time: "2 minutes ago", status: "success" },
    { type: "New Product", description: "Handwoven Carpet awaiting approval", time: "15 minutes ago", status: "pending" },
    { type: "Order Completed", description: "Order #ORD-1234 completed", time: "1 hour ago", status: "success" },
    { type: "Report", description: "Product reported by user", time: "2 hours ago", status: "warning" },
    { type: "New Seller", description: "Artisan Co. pending approval", time: "3 hours ago", status: "pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "warning":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Overview of MadeInPK platform performance and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h3 className="text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Top Selling Categories</CardTitle>
            <CardDescription>Best performing product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.orders} orders</p>
                    </div>
                  </div>
                  <p className="text-emerald-700">{category.sales}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Users by Region</CardTitle>
            <CardDescription>Geographic distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRegions.map((region) => (
                <div key={region.name}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{region.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{region.users} users</p>
                      <Badge variant="outline" className="border-emerald-600 text-emerald-700">
                        {region.percentage}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: region.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">Recent Activity</CardTitle>
          <CardDescription>Latest platform activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                  <div>
                    <p className="text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
