import { UploadWizard } from '@/components/upload-wizard';

export default function UploadPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Create a new Reel</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your media and use AI to perfect your post.
        </p>
      </div>
      <UploadWizard />
    </div>
  );
}
