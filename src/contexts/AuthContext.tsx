import { createContext, useContext, useState, ReactNode } from "react";

// List of admin emails - only these users get admin access
const ADMIN_EMAILS = [
  "admin@madeinpk.com",
  "owner@madeinpk.com",
  "haris@madeinpk.com", // Add your email here
];

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
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean; // New admin flag
  isSeller: boolean; // Seller flag
  sellerInfo?: SellerInfo; // Seller business details
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // New admin check
  isSeller: boolean; // Seller check
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  becomeSeller: (sellerInfo: SellerInfo) => void; // New method to upgrade to seller
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Check if email is in admin list
    const isAdminUser = ADMIN_EMAILS.includes(email.toLowerCase());
    
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: "1",
      name: isAdminUser ? "Admin User" : "Haris Masood",
      email: email,
      phone: "+92 300 1234567",
      isAdmin: isAdminUser,
      isSeller: false, // Default to not a seller
    };
    setUser(mockUser);
  };

  const signup = (name: string, email: string, password: string) => {
    // Check if email is in admin list
    const isAdminUser = ADMIN_EMAILS.includes(email.toLowerCase());
    
    // Mock signup - in real app, this would call an API
    const mockUser: User = {
      id: "1",
      name: name,
      email: email,
      isAdmin: isAdminUser,
      isSeller: false, // Default to not a seller
    };
    setUser(mockUser);
  };

  const becomeSeller = (sellerInfo: SellerInfo) => {
    if (user) {
      setUser({ ...user, isSeller: true, sellerInfo });
    }
  };

  const logout = () => {
    setUser(null);
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