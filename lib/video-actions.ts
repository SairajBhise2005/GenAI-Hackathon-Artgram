"use server";

import { generateVideoWithHeyGen } from "./ai-services";

export async function generateVideoAction(
  images: File[],
  script: string,
  productName: string
): Promise<{ success: boolean; videoUrl?: string; error?: string }> {
  try {
    console.log("Server action: Starting video generation...");
    console.log("Product:", productName);
    console.log("Script:", script);
    console.log("Images count:", images.length);

    const videoUrl = await generateVideoWithHeyGen(images, script, productName);

    console.log("Server action: Video generation completed. URL:", videoUrl);

    return {
      success: true,
      videoUrl,
    };
  } catch (error) {
    console.error("Server action: Video generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

