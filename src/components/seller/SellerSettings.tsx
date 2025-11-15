import { useState, useEffect } from "react";
import { Store, User, Bell, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { useAddress } from "../../contexts/AddressContext";
import { sellerService } from "../../services/sellerService";
import { authService } from "../../services/authService";
import { toast } from "sonner";

export function SellerSettings() {
  const { user, updateProfile } = useAuth();
  const { addresses, refreshAddresses } = useAddress();
  
  // Store Settings
  const [sellerProfileId, setSellerProfileId] = useState<number | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeAddressId, setStoreAddressId] = useState<number | null>(null);
  const [storePhone, setStorePhone] = useState("");
  const [website, setWebsite] = useState("");
  
  // Personal Settings
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Notification Settings (Dummy - stored locally)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSellerData();
    refreshAddresses();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      if (user) {
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
        setEmail(user.email || "");
        setPhone(user.phone_number || "");
      }
      
      // Load seller profile data
      const sellerProfile = await sellerService.getMySellerProfile();
      setSellerProfileId(sellerProfile.id);
      setStoreName(sellerProfile.brand_name || "");
      setStoreDescription(sellerProfile.biography || "");
      setStoreAddressId(sellerProfile.business_address_id || null);
      setStorePhone(sellerProfile.business_phone || "");
      setWebsite(sellerProfile.website || "");
      
      // Load addresses
      await refreshAddresses();
      
      // Load notification preferences from localStorage
      const savedPrefs = localStorage.getItem('notificationPreferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setEmailNotifications(prefs.email ?? true);
        setOrderNotifications(prefs.orders ?? true);
        setMessageNotifications(prefs.messages ?? true);
      }
    } catch (error: any) {
      console.error('Failed to load seller data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = async () => {
    if (!sellerProfileId) {
      toast.error("Seller profile not found");
      return;
    }
    
    try {
      setSaving(true);
      await sellerService.updateSellerProfile(sellerProfileId, {
        brand_name: storeName,
        biography: storeDescription,
        business_address_id: storeAddressId,
        business_phone: storePhone,
        website: website || undefined,
      });
      toast.success("Store settings updated successfully!");
    } catch (error: any) {
      console.error('Failed to update store settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePersonal = async () => {
    try {
      setSaving(true);
      const updatedUser = await authService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone
      });
      updateProfile(updatedUser);
      toast.success("Personal information updated successfully!");
    } catch (error: any) {
      console.error('Failed to update personal info:', error);
      toast.error(error.response?.data?.message || 'Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    // Save to localStorage (dummy functionality)
    const preferences = {
      email: emailNotifications,
      orders: orderNotifications,
      messages: messageNotifications
    };
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    toast.success("Notification preferences saved!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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
            <select
              id="storeAddress"
              value={storeAddressId || ""}
              onChange={(e) => setStoreAddressId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 mt-1"
            >
              <option value="">Select your store address</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.street_address}, {addr.city_name}, {addr.province_name}
                </option>
              ))}
            </select>
            {addresses.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No addresses found. Please add an address from your account settings.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This helps buyers find your products when filtering by region
            </p>
          </div>
          
          <div>
            <Label htmlFor="storePhone">Business Phone</Label>
            <div className="flex gap-2 mt-1">
              <div className="flex items-center gap-2 px-3 border rounded-md bg-gray-50 w-20">
                <span className="text-lg">🇵🇰</span>
                <span className="text-sm text-gray-600">+92</span>
              </div>
              <Input
                id="storePhone"
                type="tel"
                placeholder="300 1234567"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-website.com"
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleSaveStore} 
            className="bg-emerald-700 hover:bg-emerald-800"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Store Settings"}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
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
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <Button 
            onClick={handleSavePersonal} 
            className="bg-emerald-700 hover:bg-emerald-800"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Personal Information"}
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
          <p className="text-sm text-gray-500 mt-1">These settings are saved locally on your device</p>
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

      {/* Security */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-gray-900">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Manage your account security settings
          </p>
          <Button variant="outline" className="w-full" disabled>
            Change Password (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
