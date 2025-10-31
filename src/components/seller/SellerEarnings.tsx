import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { sellerService } from "../../services/sellerService";
import { MOCK_MODE } from "../../lib/mockMode";
import { toast } from "sonner";

export function SellerEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [earningsData, setEarningsData] = useState({
    currentMonth: 45200,
    lastMonth: 38300,
    totalEarnings: 234500,
    pendingPayouts: 12500,
  });
  const [monthlyChartData, setMonthlyChartData] = useState<Array<{ month: string; amount: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    if (MOCK_MODE) {
      // Use mock data
      setLoading(false);
      return;
    }

    // Backend mode
    try {
      setLoading(true);
      const earnings = await sellerService.getSellerEarnings();
      
      setEarningsData({
        currentMonth: parseFloat(earnings.completed_earnings || '0'),
        lastMonth: 0, // Calculate from monthly data if needed
        totalEarnings: parseFloat(earnings.total_earnings || '0'),
        pendingPayouts: parseFloat(earnings.pending_earnings || '0'),
      });

      setMonthlyChartData(earnings.earnings_by_month || []);
    } catch (error: any) {
      console.error('Error loading earnings:', error);
      toast.error(error.response?.data?.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const monthlyData = [
    { name: "Week 1", earnings: 8500 },
    { name: "Week 2", earnings: 12300 },
    { name: "Week 3", earnings: 10200 },
    { name: "Week 4", earnings: 14200 },
  ];

  const quarterlyData = [
    { name: "Jan", earnings: 35200 },
    { name: "Feb", earnings: 38300 },
    { name: "Mar", earnings: 45200 },
  ];

  const yearlyData = [
    { name: "Jan", earnings: 35200 },
    { name: "Feb", earnings: 38300 },
    { name: "Mar", earnings: 45200 },
    { name: "Apr", earnings: 42100 },
    { name: "May", earnings: 48900 },
    { name: "Jun", earnings: 51200 },
    { name: "Jul", earnings: 47800 },
    { name: "Aug", earnings: 52300 },
    { name: "Sep", earnings: 49500 },
    { name: "Oct", earnings: 45200 },
  ];

  const productPerformance = [
    { name: "Shawls", sales: 45 },
    { name: "Pottery", sales: 32 },
    { name: "Jewelry", sales: 38 },
    { name: "Metalwork", sales: 28 },
    { name: "Carpets", sales: 15 },
  ];

  const getChartData = () => {
    switch (selectedPeriod) {
      case "week":
        return monthlyData.slice(0, 1);
      case "month":
        return monthlyData;
      case "quarter":
        return quarterlyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const transactions = [
    {
      id: "TXN-2025-048",
      description: "Order ORD-2025-048 - Hand-Embroidered Shawl",
      date: "Oct 24, 2025",
      amount: "+7,000",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-700",
    },
    {
      id: "TXN-2025-047",
      description: "Order ORD-2025-047 - Blue Pottery Vase Set",
      date: "Oct 23, 2025",
      amount: "+2,800",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "TXN-2025-046",
      description: "Order ORD-2025-046 - Brass Candle Holders",
      date: "Oct 22, 2025",
      amount: "+5,700",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "TXN-2025-045",
      description: "Order ORD-2025-045 - Handwoven Carpet",
      date: "Oct 21, 2025",
      amount: "+12,500",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-700",
    },
    {
      id: "TXN-2025-044",
      description: "Payout to Bank Account",
      date: "Oct 20, 2025",
      amount: "-25,000",
      status: "Completed",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "TXN-2025-043",
      description: "Order ORD-2025-043 - Traditional Jewelry Set",
      date: "Oct 18, 2025",
      amount: "+5,500",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
  ];

  const growthPercentage = Math.round(((earningsData.currentMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Earnings</h1>
          <p className="text-gray-600">Track your revenue and payments</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-sm text-emerald-600">+{growthPercentage}%</span>
            </div>
            <h3 className="text-gray-900 mb-1">PKR {earningsData.currentMonth.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">This Month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">PKR {earningsData.lastMonth.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Last Month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">PKR {earningsData.totalEarnings.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">PKR {earningsData.pendingPayouts.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Pending Payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Earnings']}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Performance Chart */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Product Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value} sales`, 'Total Sales']}
              />
              <Bar 
                dataKey="sales" 
                fill="#059669"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Amount (PKR)
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{transaction.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${transaction.statusColor}`}>{transaction.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
