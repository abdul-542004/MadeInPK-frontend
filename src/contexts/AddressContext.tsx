import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  addressService, 
  Address as BackendAddress, 
  Province, 
  City,
  CreateAddressRequest 
} from "../services/addressService";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Keep old interface for backward compatibility, but add backend fields
export interface Address {
  id: number;
  user?: number;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: number;
  city_name?: string;
  province: number;
  province_name?: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AddressContextType {
  addresses: Address[];
  provinces: Province[];
  cities: City[];
  loading: boolean;
  addAddress: (address: CreateAddressRequest) => Promise<void>;
  updateAddress: (id: number, address: Partial<CreateAddressRequest>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
  getDefaultAddress: () => Address | undefined;
  loadProvinces: () => Promise<void>;
  loadCities: (provinceId?: number) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load addresses and provinces on mount
  useEffect(() => {
    if (MOCK_MODE || isAuthenticated) {
      refreshAddresses();
      loadProvinces();
    }
  }, [isAuthenticated]);

  const refreshAddresses = async () => {
    if (!isAuthenticated && !MOCK_MODE) return;

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(300);
        const saved = localStorage.getItem('mockAddresses');
        const mockAddresses = saved ? JSON.parse(saved) : [];
        setAddresses(mockAddresses);
      } else {
        const data = await addressService.getAddresses();
        // Ensure data is always an array
        const addressArray = Array.isArray(data) ? data : [];
        setAddresses(addressArray);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      // Set empty array on error to prevent crashes
      setAddresses([]);
      if (!MOCK_MODE) {
        toast.error('Failed to load addresses');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProvinces = async () => {
    try {
      if (MOCK_MODE) {
        // Mock provinces
        setProvinces([
          { id: 1, name: 'Punjab' },
          { id: 2, name: 'Sindh' },
          { id: 3, name: 'Khyber Pakhtunkhwa' },
          { id: 4, name: 'Balochistan' },
          { id: 5, name: 'Gilgit-Baltistan' },
        ]);
      } else {
        const data = await addressService.getProvinces();
        setProvinces(data);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
    }
  };

  const loadCities = async (provinceId?: number) => {
    try {
      if (MOCK_MODE) {
        // Mock cities
        const mockCities: City[] = [
          { id: 1, name: 'Lahore', province: 1, province_name: 'Punjab' },
          { id: 2, name: 'Karachi', province: 2, province_name: 'Sindh' },
          { id: 3, name: 'Islamabad', province: 1, province_name: 'Punjab' },
          { id: 4, name: 'Faisalabad', province: 1, province_name: 'Punjab' },
          { id: 5, name: 'Multan', province: 1, province_name: 'Punjab' },
        ];
        setCities(provinceId ? mockCities.filter(c => c.province === provinceId) : mockCities);
      } else {
        const data = await addressService.getCities(provinceId);
        setCities(data);
      }
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const addAddress = async (addressData: CreateAddressRequest) => {
    if (!isAuthenticated && !MOCK_MODE) {
      toast.error('Please login to add address');
      return;
    }

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(500);
        const selectedCity = cities.find(c => c.id === addressData.city);
        const selectedProvince = provinces.find(p => selectedCity?.province === p.id);
        const newAddress: Address = {
          ...addressData,
          id: Date.now(),
          user: user?.id || 0,
          is_default: addressData.is_default || addresses.length === 0,
          city_name: selectedCity?.name || '',
          province: selectedProvince?.id || 0,
          province_name: selectedProvince?.name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updated = [...addresses, newAddress];
        setAddresses(updated);
        localStorage.setItem('mockAddresses', JSON.stringify(updated));
        toast.success('Address added successfully');
      } else {
        const newAddress = await addressService.createAddress(addressData);
        setAddresses((prev) => [...prev, newAddress]);
        toast.success('Address added successfully');
      }
    } catch (error: any) {
      console.error('Failed to add address:', error);
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: number, updatedFields: Partial<CreateAddressRequest>) => {
    if (!isAuthenticated && !MOCK_MODE) return;

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(500);
        const updated = addresses.map((addr) =>
          addr.id === id ? { ...addr, ...updatedFields } : addr
        );
        setAddresses(updated);
        localStorage.setItem('mockAddresses', JSON.stringify(updated));
        toast.success('Address updated successfully');
      } else {
        const updatedAddress = await addressService.updateAddress(id, updatedFields);
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === id ? updatedAddress : addr))
        );
        toast.success('Address updated successfully');
      }
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    if (!isAuthenticated && !MOCK_MODE) return;

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(300);
        const updated = addresses.filter((addr) => addr.id !== id);
        // If we deleted the default address, make the first one default
        if (updated.length > 0 && !updated.some((addr) => addr.is_default)) {
          updated[0].is_default = true;
        }
        setAddresses(updated);
        localStorage.setItem('mockAddresses', JSON.stringify(updated));
        toast.success('Address deleted');
      } else {
        await addressService.deleteAddress(id);
        setAddresses((prev) => {
          const filtered = prev.filter((addr) => addr.id !== id);
          return filtered;
        });
        toast.success('Address deleted');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id: number) => {
    if (!isAuthenticated && !MOCK_MODE) return;

    try {
      if (MOCK_MODE) {
        const updated = addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === id,
        }));
        setAddresses(updated);
        localStorage.setItem('mockAddresses', JSON.stringify(updated));
      } else {
        const updatedAddress = await addressService.setDefaultAddress(id);
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            is_default: addr.id === id,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const getDefaultAddress = () => {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return undefined;
    }
    return addresses.find((addr) => addr.is_default);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        provinces,
        cities,
        loading,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        loadProvinces,
        loadCities,
        refreshAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
