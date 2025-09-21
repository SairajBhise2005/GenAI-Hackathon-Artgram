"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordAction } from "@/lib/auth";
import { type AuthState } from "@/lib/auth-types";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AuthState>({ message: "" });

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await resetPasswordAction(state, formData);
      setState(result);

      if (result.success) {
        toast({
          title: "Email sent!",
          description: "Check your inbox for password reset instructions.",
        });
      } else if (result.error) {
        toast({
          title: "Failed to send email",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <form action={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            We'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Reset Email
              </>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/signin"
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
