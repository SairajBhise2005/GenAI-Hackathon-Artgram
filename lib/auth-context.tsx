"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  userType: "customer" | "artisan";
  phone?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  socialMedia?: Record<string, string>;
  isVerified?: boolean;
  isActive?: boolean;
  lastLoginAt?: string;
  // Artisan-specific fields
  businessName?: string;
  artForm?: string;
  yearsPracticing?: number;
  rating?: number;
  totalRatings?: number;
  totalOrders?: number;
  isFeatured?: boolean;
  // Customer-specific fields
  totalSpent?: number;
  loyaltyPoints?: number;
} | null;

type AuthContextType = {
  user: AppUser;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuthStatus();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user && !error) {
        await fetchUserProfile(user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (authUser: User) => {
    try {
      // First get the base user data
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (userError) {
        console.error("Error fetching user profile:", userError);
        // Fallback to basic user data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || "",
          userType: authUser.user_metadata?.user_type || "customer",
        });
        return;
      }

      // Get role-specific data
      let roleData = {};
      if (user.user_type === "artisan") {
        const { data: artisanData } = await supabase
          .from("artisans")
          .select("*")
          .eq("id", authUser.id)
          .single();
        roleData = artisanData || {};
      } else if (user.user_type === "customer") {
        const { data: customerData } = await supabase
          .from("customers")
          .select("*")
          .eq("id", authUser.id)
          .single();
        roleData = customerData || {};
      }

      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        phone: user.phone,
        profileImageUrl: user.profile_image_url,
        bio: user.bio,
        location: user.location,
        websiteUrl: user.website_url,
        socialMedia: user.social_media || {},
        isVerified: user.is_verified,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at,
        ...roleData,
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Fallback to basic user data
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || "",
        userType: authUser.user_metadata?.user_type || "customer",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
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
