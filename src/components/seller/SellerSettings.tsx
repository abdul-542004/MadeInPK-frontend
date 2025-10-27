import { useState } from "react";
import { Store, User, Bell, Lock, CreditCard, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

export function SellerSettings() {
  const { user } = useAuth();
  
  // Store Settings
  const [storeName, setStoreName] = useState("Ayesha's Handicrafts");
  const [storeDescription, setStoreDescription] = useState("Authentic Pakistani handcrafted items with love and tradition");
  
  // Personal Settings
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  
  // Bank Details
  const [bankName, setBankName] = useState("Habib Bank Limited");
  const [accountNumber, setAccountNumber] = useState("****1234");
  const [accountTitle, setAccountTitle] = useState(user?.name || "");

  const handleSaveStore = () => {
    toast.success("Store settings updated successfully!");
  };

  const handleSavePersonal = () => {
    toast.success("Personal information updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleSaveBank = () => {
    toast.success("Bank details updated successfully!");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600">Manage your seller account and preferences</p>
      </div>

      {/* Store Information */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Store Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="mt-1 min-h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="storeAddress">Store Address</Label>
            <div className="flex gap-2 mt-1">
              <MapPin className="h-5 w-5 text-gray-400 mt-2" />
              <Textarea
                id="storeAddress"
                placeholder="Enter your complete store address"
                className="flex-1 min-h-20"
              />
            </div>
          </div>

          <Button onClick={handleSaveStore} className="bg-emerald-700 hover:bg-emerald-800">
            Save Store Settings
          </Button>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2 mt-1">
              <div className="flex items-center gap-2 px-3 border rounded-md bg-gray-50 w-20">
                <span className="text-lg">🇵🇰</span>
                <span className="text-sm text-gray-600">+92</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="300 1234567"
                value={phone?.replace("+92 ", "") || ""}
                onChange={(e) => setPhone(`+92 ${e.target.value}`)}
                className="flex-1"
              />
            </div>
          </div>

          <Button onClick={handleSavePersonal} className="bg-emerald-700 hover:bg-emerald-800">
            Save Personal Information
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Order Notifications</p>
              <p className="text-xs text-gray-600">Get notified about new orders</p>
            </div>
            <Switch
              checked={orderNotifications}
              onCheckedChange={setOrderNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Message Notifications</p>
              <p className="text-xs text-gray-600">Get notified about customer messages</p>
            </div>
            <Switch
              checked={messageNotifications}
              onCheckedChange={setMessageNotifications}
            />
          </div>

          <Button onClick={handleSaveNotifications} className="bg-emerald-700 hover:bg-emerald-800">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Bank Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="accountTitle">Account Title</Label>
            <Input
              id="accountTitle"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1"
              type="password"
            />
            <p className="text-xs text-gray-500 mt-1">Your account number is encrypted and secure</p>
          </div>

          <Button onClick={handleSaveBank} className="bg-emerald-700 hover:bg-emerald-800">
            Save Bank Details
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
