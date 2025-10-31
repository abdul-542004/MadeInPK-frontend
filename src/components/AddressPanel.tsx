import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useAddress } from "../contexts/AddressContext";
import { toast } from "sonner";

interface AddressPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressPanel({ open, onOpenChange }: AddressPanelProps) {
  const { addAddress, provinces, cities, loadCities } = useAddress();
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: 0,
    province: 0,
    postal_code: "",
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = (provinceId: number) => {
    setFormData((prev) => ({ ...prev, province: provinceId, city: 0 }));
    loadCities(provinceId);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.full_name ||
      !formData.phone_number ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.postal_code
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addAddress({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        postal_code: formData.postal_code,
        is_default: false,
      });

      // Reset form
      setFormData({
        full_name: "",
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: 0,
        province: 0,
        postal_code: "",
      });

      onOpenChange(false);
    } catch (error) {
      // Error already handled by context
    }
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
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm text-gray-700">
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter full name"
                className="w-full"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-sm text-gray-700">
                Phone Number *
              </Label>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 min-w-[80px]">
                  <span className="text-lg">🇵🇰</span>
                  <span className="text-sm">+92</span>
                </div>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="3001234567"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor="address_line1" className="text-sm text-gray-700">
                Address Line 1 *
              </Label>
              <Input
                id="address_line1"
                value={formData.address_line1}
                onChange={(e) => handleInputChange("address_line1", e.target.value)}
                placeholder="House # / Street / Area"
                className="w-full"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="address_line2" className="text-sm text-gray-700">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="address_line2"
                value={formData.address_line2}
                onChange={(e) => handleInputChange("address_line2", e.target.value)}
                placeholder="Landmark or additional details"
                className="w-full"
              />
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm text-gray-700">
                Province *
              </Label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => handleProvinceChange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
              >
                <option value={0}>Select Province</option>
                {Array.isArray(provinces) && provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm text-gray-700">
                City *
              </Label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                disabled={!formData.province}
              >
                <option value={0}>Select City</option>
                {Array.isArray(cities) && cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-sm text-gray-700">
                Postal Code *
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange("postal_code", e.target.value)}
                placeholder="e.g., 54000"
                className="w-full"
              />
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