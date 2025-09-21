"use server";

import { redirect } from "next/navigation";
import { SignInSchema, SignUpSchema, type AuthState } from "@/lib/auth-types";

// Simple in-memory storage for demo purposes
const users = new Map<
  string,
  {
    id: string;
    email: string;
    name: string;
    userType: string;
    password: string;
  }
>();

// Sign in action (mock)
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
    const user = users.get(email);

    if (!user || user.password !== password) {
      return {
        message: "Sign in failed",
        error: "Invalid email or password",
      };
    }

    // In a real app, you'd set a session cookie here
    return {
      message: "Successfully signed in!",
      success: true,
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      message: "Sign in failed",
      error: "An unexpected error occurred",
    };
  }
}

// Sign up action (mock)
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

    if (users.has(email)) {
      return {
        message: "Sign up failed",
        error: "An account with this email already exists",
      };
    }

    // Create user in memory
    const userId = `user_${Date.now()}`;
    users.set(email, {
      id: userId,
      email,
      name,
      userType,
      password, // In real app, this would be hashed
    });

    return {
      message: "Account created successfully! You can now sign in.",
      success: true,
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return {
      message: "Sign up failed",
      error: "An unexpected error occurred",
    };
  }
}

// Sign out action (mock)
export async function signOutAction(): Promise<AuthState> {
  return {
    message: "Successfully signed out",
    success: true,
  };
}

// Get current user (mock)
export async function getCurrentUser() {
  // In a real app, you'd get this from session/cookies
  return null;
}

// Require authentication (mock)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

// Reset password action (mock)
export async function resetPasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      message: "Email is required",
      error: "Please enter your email address",
    };
  }

  if (!users.has(email)) {
    return {
      message: "Password reset failed",
      error: "No account found with this email address",
    };
  }

  return {
    message:
      "Password reset email sent! (This is a demo - no email was actually sent)",
    success: true,
  };
}

