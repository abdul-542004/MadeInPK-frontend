import { useState, useEffect } from "react";
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
    street_address: "",
    city: 0,
    province: 0,
    postal_code: "",
  });

  // Debug logging
  useEffect(() => {
    console.log('AddressPanel - provinces:', provinces);
    console.log('AddressPanel - cities:', cities);
  }, [provinces, cities]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = (provinceId: number) => {
    console.log('Province changed to:', provinceId);
    setFormData((prev) => ({ ...prev, province: provinceId, city: 0 }));
    if (provinceId > 0) {
      loadCities(provinceId);
    } else {
      // Clear cities if no province selected
      loadCities(undefined);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.street_address ||
      !formData.city ||
      !formData.postal_code
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addAddress({
        street_address: formData.street_address,
        city: formData.city,
        postal_code: formData.postal_code,
        is_default: false,
      });

      // Reset form
      setFormData({
        street_address: "",
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
            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="street_address" className="text-sm text-gray-700">
                Street Address *
              </Label>
              <Input
                id="street_address"
                value={formData.street_address}
                onChange={(e) => handleInputChange("street_address", e.target.value)}
                placeholder="House # / Street / Area / Landmark"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Include complete address with house/building number and area
              </p>
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
                <option value={0}>
                  {!formData.province 
                    ? "Select a province first" 
                    : cities.length === 0 
                    ? "Loading cities..." 
                    : "Select City"}
                </option>
                {Array.isArray(cities) && cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {formData.province && cities.length === 0 && (
                <p className="text-xs text-amber-600">
                  No cities available for this province
                </p>
              )}
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