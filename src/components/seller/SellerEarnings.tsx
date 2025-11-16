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
    currentMonth: 0,
    lastMonth: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
  });
  const [chartData, setChartData] = useState<{
    week: Array<{ name: string; earnings: number }>;
    month: Array<{ month: string; amount: string; earnings: number }>;
    quarter: Array<{ name: string; earnings: number }>;
    year: Array<{ name: string; earnings: number }>;
  }>({
    week: [],
    month: [],
    quarter: [],
    year: [],
  });
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    description: string;
    date: string;
    amount: string;
    status: string;
    statusColor: string;
  }>>([]);
  const [productPerformance, setProductPerformance] = useState<Array<{
    id: number;
    name: string;
    total_orders: number;
    total_quantity_sold: number;
    total_revenue: string;
    average_order_value: string;
  }>>([]);
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
      
      // Load earnings data
      const earnings = await sellerService.getSellerEarnings();
      
      setEarningsData({
        currentMonth: parseFloat(earnings.current_month || '0'),
        lastMonth: parseFloat(earnings.last_month || '0'),
        totalEarnings: parseFloat(earnings.total_earnings || '0'),
        pendingPayouts: parseFloat(earnings.pending_payouts || '0'),
      });

      setChartData({
        week: earnings.earnings_by_week || [],
        month: earnings.earnings_by_month || [],
        quarter: earnings.earnings_by_quarter || [],
        year: earnings.earnings_by_year || [],
      });

      // Set product performance from earnings data
      setProductPerformance(earnings.product_performance || []);

      // Load transactions
      const transactionData = await sellerService.getSellerTransactions({ limit: 10 });
      setTransactions(transactionData.transactions.map(t => ({
        id: t.id,
        description: t.description,
        date: t.date,
        amount: t.amount,
        status: t.status,
        statusColor: t.status_color,
      })));

    } catch (error: any) {
      console.error('Error loading earnings:', error);
      toast.error(error.response?.data?.error || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    switch (selectedPeriod) {
      case "week":
        return chartData.week;
      case "month":
        return chartData.month.map(item => ({ name: item.month, earnings: item.earnings }));
      case "quarter":
        return chartData.quarter;
      case "year":
        return chartData.year;
      default:
        return chartData.month.map(item => ({ name: item.month, earnings: item.earnings }));
    }
  };

  const growthPercentage = earningsData.lastMonth > 0 
    ? Math.round(((earningsData.currentMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

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
          {productPerformance.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                    formatter={(value: number) => [`${value} orders`, 'Total Orders']}
                  />
                  <Bar 
                    dataKey="total_orders" 
                    fill="#059669"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Product Performance Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Revenue (PKR)
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Avg Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productPerformance.slice(0, 10).map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 font-medium">{product.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{product.total_orders}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{product.total_quantity_sold}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-emerald-600 font-medium">
                            {parseFloat(product.total_revenue).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {parseFloat(product.average_order_value).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No product sales data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length > 0 ? (
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
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No transactions yet. Start selling to see your transaction history!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
