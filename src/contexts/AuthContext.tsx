import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, AuthResponse, UserProfile } from "../services/api";
import { toast } from "sonner";

interface SellerInfo {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isSeller: boolean;
  sellerInfo?: SellerInfo;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  becomeSeller: (sellerInfo: SellerInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authApi.getProfile();
          if (response.data) {
            setUser(mapProfileToUser(response.data));
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const mapProfileToUser = (profile: UserProfile): User => {
    return {
      id: profile.id,
      username: profile.username,
      name: `${profile.first_name} ${profile.last_name}`.trim() || profile.username,
      email: profile.email,
      phone: profile.phone_number,
      isAdmin: profile.is_staff,
      isSeller: profile.is_seller,
      sellerInfo: profile.seller_profile ? {
        businessName: profile.seller_profile.brand_name,
        businessPhone: '',
        businessAddress: '',
        businessDescription: profile.seller_profile.biography,
      } : undefined,
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      if (response.data) {
        localStorage.setItem('authToken', response.data.token);
        setUser(mapProfileToUser(response.data.user as any));
        toast.success('Logged in successfully!');
        return true;
      } else if (response.error) {
        toast.error(response.error);
        return false;
      }
      return false;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await authApi.register({
        username: email.split('@')[0],
        email,
        password,
        password_confirm: password,
        first_name: firstName,
        last_name: lastName,
      });
      
      if (response.data) {
        localStorage.setItem('authToken', response.data.token);
        setUser(mapProfileToUser(response.data.user as any));
        toast.success('Account created successfully!');
        return true;
      } else if (response.error) {
        toast.error(response.error);
        return false;
      }
      return false;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const becomeSeller = (sellerInfo: SellerInfo) => {
    if (user) {
      setUser({ ...user, isSeller: true, sellerInfo });
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isSeller: user?.isSeller || false,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        becomeSeller,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}