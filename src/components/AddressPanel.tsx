import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useAddress } from "../contexts/AddressContext";
import { toast } from "sonner@2.0.3";

interface AddressPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressPanel({ open, onOpenChange }: AddressPanelProps) {
  const { addAddress } = useAddress();
  const [formData, setFormData] = useState({
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "Pakistan",
    countryCode: "+92",
    phoneNumber: "",
    landmark: "",
    addressType: "home" as "home" | "office",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.phoneNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    addAddress({
      ...formData,
      isDefault: false,
    });

    // Reset form
    setFormData({
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      country: "Pakistan",
      countryCode: "+92",
      phoneNumber: "",
      landmark: "",
      addressType: "home",
    });

    toast.success("Address added successfully");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="border-b pb-4 px-6 pt-6">
          <SheetTitle>Add Delivery Address</SheetTitle>
          <SheetDescription>Enter your delivery address details</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-sm text-gray-700">
                Address Line 1
              </Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                placeholder="Enter your address"
                className="w-full"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm text-gray-700">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
                className="w-full"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm text-gray-700">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Enter state"
                className="w-full"
              />
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-sm text-gray-700">
                Pincode
              </Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                placeholder="Enter pincode"
                className="w-full"
              />
            </div>

            {/* Country with Phone Code */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm text-gray-700">
                Country
              </Label>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 min-w-[120px]">
                  <span className="text-lg">🇵🇰</span>
                  <span className="text-sm">{formData.countryCode}</span>
                </div>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Phone number"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Landmark */}
            <div className="space-y-2">
              <Label htmlFor="landmark" className="text-sm text-gray-700">
                Landmark
              </Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
                placeholder="Enter landmark (optional)"
                className="w-full"
              />
            </div>

            {/* Address Type */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">Address Type</Label>
              <RadioGroup
                value={formData.addressType}
                onValueChange={(value) =>
                  handleInputChange("addressType", value as "home" | "office")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="cursor-pointer">
                    Home
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label htmlFor="office" className="cursor-pointer">
                    Office
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t px-6 py-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            SAVE
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}