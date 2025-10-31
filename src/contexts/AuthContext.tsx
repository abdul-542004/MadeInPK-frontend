import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService } from "../services/authService";
import { User, UserRole, RegisterRequest } from "../types/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";

interface SellerInfo {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: RegisterRequest) => Promise<{ success: boolean; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
  becomeSeller: (sellerInfo: SellerInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (MOCK_MODE) {
          // In mock mode, just use stored user if exists
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (parseError) {
              console.warn('Failed to parse user from localStorage');
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
            }
          }
        } else if (token && storedUser) {
          try {
            // Verify token is still valid by fetching profile
            const userData = await authService.getProfile();
            setUser(userData);
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (MOCK_MODE) {
        // Mock login - accept any credentials
        await mockDelay(500);
        const mockUser: User = {
          id: 1,
          username: email.split('@')[0],
          email: email,
          first_name: 'Demo',
          last_name: 'User',
          phone_number: '0300-1234567',
          profile_picture: null,
          profile_picture_url: null,
          role: 'both' as UserRole,
          is_blocked: false,
          failed_payment_count: 0,
          created_at: new Date().toISOString(),
        };
        
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true };
      }
      
      const response = await authService.login({ email, password });
      
      // Save token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      
      if (axiosError.response?.status === 401) {
        return { success: false, error: 'Invalid email or password' };
      } else if (axiosError.response?.status === 403) {
        return { success: false, error: axiosError.response.data?.error || 'Your account has been blocked' };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData: RegisterRequest): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    try {
      const response = await authService.register(userData);
      
      // Save token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<Record<string, string[]>>;
      
      if (axiosError.response?.data) {
        return { success: false, errors: axiosError.response.data };
      }
      
      return { success: false, errors: { general: ['Registration failed. Please try again.'] } };
    }
  };

  const becomeSeller = (sellerInfo: SellerInfo) => {
    // This would need to call a backend API to upgrade user to seller
    // For now, just log the seller info
    console.log('Become seller:', sellerInfo);
    toast.info('Seller registration feature coming soon!');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and localStorage regardless of API response
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      toast.error('Failed to refresh profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller' || user?.role === 'both',
        isBuyer: user?.role === 'buyer' || user?.role === 'both',
        loading,
        login,
        signup,
        logout,
        updateProfile,
        refreshProfile,
        becomeSeller,
      }}
    >
      {!loading && children}
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