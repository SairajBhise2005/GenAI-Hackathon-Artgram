import { ContentCreator } from "@/components/content-creator";
import { DebugVideo } from "@/components/debug-video";

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <ContentCreator />
      <div className="flex justify-center">
        <DebugVideo />
      </div>
    </div>
  );
}
