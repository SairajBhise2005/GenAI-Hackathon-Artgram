import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Reset Password</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
