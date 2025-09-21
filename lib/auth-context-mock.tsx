"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  userType: "customer" | "artisan";
} | null;

type AuthContextType = {
  user: AppUser;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
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

