import { SignupWizard } from '@/components/signup-wizard';

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Join Artisan Reels</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Whether you're here to discover or to create, we're glad to have you.
        </p>
      </div>
      <SignupWizard />
    </div>
  );
}
