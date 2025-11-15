import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { useAddress } from "../contexts/AddressContext";
import { MapPin, Plus, Trash2, Check } from "lucide-react";
import { AddressPanel } from "./AddressPanel";
import { toast } from "sonner";

interface ManageAddressesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageAddressesPanel({ open, onOpenChange }: ManageAddressesPanelProps) {
  const { addresses, loading, deleteAddress, setDefaultAddress } = useAddress();
  const [showAddAddressPanel, setShowAddAddressPanel] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    toast.success("Default address updated");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="border-b pb-4 px-6 pt-6">
            <SheetTitle>My Addresses</SheetTitle>
            <SheetDescription>Manage your delivery addresses</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No addresses saved yet</p>
                <Button
                  onClick={() => setShowAddAddressPanel(true)}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 ${
                      address.is_default ? "border-emerald-500 bg-emerald-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {address.street_address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city_name}, {address.province_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.postal_code}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {address.is_default ? (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Default Address
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-xs text-gray-600 hover:text-emerald-700 underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {addresses.length > 0 && (
            <div className="border-t px-6 py-4">
              <Button
                onClick={() => setShowAddAddressPanel(true)}
                className="w-full bg-emerald-700 hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AddressPanel
        open={showAddAddressPanel}
        onOpenChange={setShowAddAddressPanel}
      />
    </>
  );
}
