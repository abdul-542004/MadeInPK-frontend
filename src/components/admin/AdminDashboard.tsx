import { useState } from "react";
import { 
  LayoutDashboard,
  Users,
  Store,
  Package,
  DollarSign,
  Flag,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LogOut
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminUserManagement } from "./AdminUserManagement";
import { AdminSellerManagement } from "./AdminSellerManagement";
import { AdminProductOversight } from "./AdminProductOversight";
import { AdminTransactions } from "./AdminTransactions";
import { AdminReports } from "./AdminReports";
import { AdminContentManagement } from "./AdminContentManagement";
import { AdminSecurity } from "./AdminSecurity";
import logo from "figma:asset/5b5a9ccaf2f6b76406aeb93df9f19f90423b3a15.png";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type AdminSection = 
  | "analytics" 
  | "users" 
  | "sellers" 
  | "products" 
  | "transactions" 
  | "reports" 
  | "content" 
  | "security";

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, isAdmin, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSection>("analytics");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => onNavigate("home")} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: "analytics" as AdminSection, label: "Analytics", icon: LayoutDashboard },
    { id: "users" as AdminSection, label: "User Management", icon: Users },
    { id: "sellers" as AdminSection, label: "Seller Management", icon: Store },
    { id: "products" as AdminSection, label: "Product Oversight", icon: Package },
    { id: "transactions" as AdminSection, label: "Transactions", icon: DollarSign },
    { id: "reports" as AdminSection, label: "Reports & Feedback", icon: Flag },
    { id: "content" as AdminSection, label: "Content Management", icon: FileText },
    { id: "security" as AdminSection, label: "Security & Access", icon: Shield },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "analytics":
        return <AdminAnalytics />;
      case "users":
        return <AdminUserManagement />;
      case "sellers":
        return <AdminSellerManagement />;
      case "products":
        return <AdminProductOversight />;
      case "transactions":
        return <AdminTransactions />;
      case "reports":
        return <AdminReports />;
      case "content":
        return <AdminContentManagement />;
      case "security":
        return <AdminSecurity />;
      default:
        return <AdminAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img src={logo} alt="MadeInPK" className="h-8 w-8" />
              <span className="text-emerald-700">Admin Panel</span>
            </button>
          )}
          {sidebarCollapsed && (
            <img src={logo} alt="MadeInPK" className="h-8 w-8 mx-auto" />
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-500"}`} />
                {!sidebarCollapsed && (
                  <span className={isActive ? "" : "text-gray-700"}>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {!sidebarCollapsed && (
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Logged in as</p>
              <p className="text-sm text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
          
          <button
            onClick={() => {
              logout();
              onNavigate("home");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}