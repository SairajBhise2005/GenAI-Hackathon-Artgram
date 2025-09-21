"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { SignInSchema, SignUpSchema, type AuthState } from "@/lib/auth-types";

// Sign in action
export async function signInAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const validatedFields = SignInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        message: "Validation failed",
        error: Object.values(validatedFields.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      };
    }

    const { email, password } = validatedFields.data;
    const supabase = createClient();

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = "An unexpected error occurred";

      switch (error.message) {
        case "Invalid login credentials":
          errorMessage = "Invalid email or password";
          break;
        case "Email not confirmed":
          errorMessage = "Please check your email and confirm your account";
          break;
        case "Too many requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }

      return {
        message: "Sign in failed",
        error: errorMessage,
      };
    }

    if (data.user) {
      // Get user profile from our custom users table
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      return {
        message: "Successfully signed in!",
        success: true,
      };
    }

    return {
      message: "Sign in failed",
      error: "An unexpected error occurred",
    };
  } catch (error: any) {
    console.error("Sign in error:", error);

    return {
      message: "Sign in failed",
      error: "An unexpected error occurred",
    };
  }
}

// Sign up action
export async function signUpAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const validatedFields = SignUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      userType: formData.get("userType"),
    });

    if (!validatedFields.success) {
      return {
        message: "Validation failed",
        error: Object.values(validatedFields.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      };
    }

    const { name, email, password, userType } = validatedFields.data;
    const supabase = createClient();

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType,
        },
      },
    });

    if (error) {
      let errorMessage = "An unexpected error occurred";

      switch (error.message) {
        case "User already registered":
          errorMessage = "An account with this email already exists";
          break;
        case "Password should be at least 6 characters":
          errorMessage = "Password must be at least 6 characters";
          break;
        case "Invalid email":
          errorMessage = "Please enter a valid email address";
          break;
        default:
          errorMessage = error.message;
      }

      return {
        message: "Sign up failed",
        error: errorMessage,
      };
    }

    if (data.user) {
      // Rely on database trigger to create profile in users table
      return {
        message:
          "Account created successfully! Please check your email to confirm your account.",
        success: true,
      };
    }

    return {
      message: "Sign up failed",
      error: "An unexpected error occurred",
    };
  } catch (error: any) {
    console.error("Sign up error:", error);

    return {
      message: "Sign up failed",
      error: "An unexpected error occurred",
    };
  }
}

// Sign out action
export async function signOutAction(): Promise<AuthState> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return {
        message: "Sign out failed",
        error: "An unexpected error occurred",
      };
    }

    return {
      message: "Successfully signed out",
      success: true,
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      message: "Sign out failed",
      error: "An unexpected error occurred",
    };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get user profile from our custom users table
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || "",
      userType:
        profile?.user_type || user.user_metadata?.user_type || "customer",
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

// Reset password action
export async function resetPasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        message: "Email is required",
        error: "Please enter your email address",
      };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      let errorMessage = "An unexpected error occurred";

      switch (error.message) {
        case "User not found":
          errorMessage = "No account found with this email address";
          break;
        case "Invalid email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }

      return {
        message: "Password reset failed",
        error: errorMessage,
      };
    }

    return {
      message: "Password reset email sent!",
      success: true,
    };
  } catch (error: any) {
    console.error("Reset password error:", error);

    return {
      message: "Password reset failed",
      error: "An unexpected error occurred",
    };
  }
}
