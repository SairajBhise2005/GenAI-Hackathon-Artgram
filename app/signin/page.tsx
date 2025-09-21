import { SignInForm } from '@/components/signin-form';

export default function SigninPage() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sign in to continue to Artisan Reels.
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
