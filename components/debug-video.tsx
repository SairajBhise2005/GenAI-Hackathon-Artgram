"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Play, CheckCircle, XCircle } from "lucide-react";
import { generateVideoAction } from "@/lib/video-actions";

export function DebugVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    videoUrl?: string;
    error?: string;
  } | null>(null);

  const handleTestVideo = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      console.log("Starting HeyGen video generation test...");
      console.log("Environment variables check:");
      console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
      console.log("HEYGEN_API_KEY exists:", !!process.env.HEYGEN_API_KEY);

      // Create a simple test with minimal data
      const mockImages: File[] = [];
      const testScript =
        "This is a test video for our artisan product showcase.";
      const testProduct = "Test Product";

      const result = await generateVideoAction(
        mockImages,
        testScript,
        testProduct
      );

      console.log("Video generation completed. Result:", result);
      console.log(
        "Is this a real video URL?",
        result.videoUrl && !result.videoUrl.includes("example.com")
      );

      setResult({
        success: result.success,
        videoUrl: result.videoUrl,
        error: result.error,
      });
    } catch (error) {
      console.error("Video generation test failed:", error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Debug Video Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleTestVideo}
          disabled={isGenerating}
          className="w-full"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Test HeyGen API
            </>
          )}
        </Button>

        {result && (
          <Alert
            className={result.success ? "border-green-500" : "border-red-500"}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className="text-xs">
                {result.success ? (
                  <div>
                    <p className="font-medium">Video generated successfully!</p>
                    <p className="text-muted-foreground mt-1">
                      URL: {result.videoUrl}
                    </p>
                    {result.videoUrl &&
                      !result.videoUrl.includes("example.com") && (
                        <div className="mt-2">
                          <video
                            src={result.videoUrl}
                            controls
                            className="w-full rounded"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Video generation failed</p>
                    <p className="text-muted-foreground mt-1">
                      Error: {result.error}
                    </p>
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
