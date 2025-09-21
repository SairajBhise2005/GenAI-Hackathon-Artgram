// AI Services for Artisan Content Generation
// Using Gemini API for text generation and Veo 3 for video generation

export interface ProductInput {
  name: string;
  description: string; // Speech-to-text converted description
  images: File[];
  videos?: File[];
  artisanName: string;
  artisanBio: string;
  price?: number;
  category: string;
}

export interface GeneratedContent {
  captions: {
    short: string; // For Instagram/TikTok
    medium: string; // For Facebook/LinkedIn
    long: string; // For blog posts
  };
  hashtags: string[];
  videoScript?: string;
  videoUrl?: string;
}

// Gemini API for text generation
export async function generateContentWithGemini(
  input: ProductInput
): Promise<GeneratedContent> {
  try {
    const prompt = `
    Create engaging social media content for an artisan product:
    
    Product: ${input.name}
    Description: ${input.description}
    Artisan: ${input.artisanName}
    Bio: ${input.artisanBio}
    Category: ${input.category}
    ${input.price ? `Price: $${input.price}` : ""}
    
    Generate:
    1. Short caption (under 100 chars) for Instagram/TikTok
    2. Medium caption (100-200 chars) for Facebook/LinkedIn  
    3. Long caption (200-400 chars) for blog posts
    4. Relevant hashtags (10-15)
    5. Video script for product showcase
    
    Make it authentic, engaging, and highlight the artisan's story and craftsmanship.
    Return the response in JSON format with the following structure:
    {
      "captions": {
        "short": "...",
        "medium": "...",
        "long": "..."
      },
      "hashtags": ["#tag1", "#tag2", ...],
      "videoScript": "..."
    }
    `;

    // Check if we have Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY not found, using mock response");
      return getMockResponse(input);
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(generatedText);
      return {
        captions: parsed.captions,
        hashtags: parsed.hashtags,
        videoScript: parsed.videoScript,
      };
    } catch (parseError) {
      // If JSON parsing fails, use the raw text
      return {
        captions: {
          short: generatedText.substring(0, 100),
          medium: generatedText.substring(0, 200),
          long: generatedText.substring(0, 400),
        },
        hashtags: ["#Handmade", "#Artisan", "#Craftsmanship"],
        videoScript: generatedText,
      };
    }
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    // Fallback to mock response
    return getMockResponse(input);
  }
}

// HeyGen AI video generation with Gemini image analysis
export async function generateVideoWithHeyGen(
  images: File[],
  script: string,
  productName: string
): Promise<string> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const heyGenApiKey = process.env.HEYGEN_API_KEY;

    console.log("Environment check - GEMINI_API_KEY exists:", !!geminiApiKey);
    console.log("Environment check - HEYGEN_API_KEY exists:", !!heyGenApiKey);
    console.log("GEMINI_API_KEY length:", geminiApiKey?.length || 0);
    console.log("HEYGEN_API_KEY length:", heyGenApiKey?.length || 0);

    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY not found, using mock video URL");
      return getMockVideoUrl(productName);
    }

    if (!heyGenApiKey) {
      console.warn("HEYGEN_API_KEY not found, using mock video URL");
      return getMockVideoUrl(productName);
    }

    console.log("Generating video with HeyGen AI...");
    console.log("Images:", images.length);
    console.log("Script:", script);
    console.log("Product:", productName);

    // Step 1: Analyze images with Gemini to create detailed video prompt
    const imageAnalysisPrompt = `Analyze these product images and create a detailed, eye-catching video prompt for HeyGen AI video generation.

Product: ${productName}
Script: ${script}
Number of images: ${images.length}

Create a detailed video prompt that includes:
1. Visual style and mood (e.g., "cinematic", "vibrant", "elegant", "rustic")
2. Camera movements (e.g., "slow zoom in", "panning shot", "close-up details")
3. Lighting description (e.g., "warm golden hour lighting", "soft studio lighting")
4. Color palette and atmosphere
5. Specific visual elements to highlight
6. Pacing and rhythm (e.g., "slow and contemplative", "dynamic and energetic")
7. Target audience appeal (e.g., "appealing to young professionals", "attracting luxury buyers")

The prompt should be optimized for HeyGen AI to create a professional product showcase video that's perfect for social media platforms like Instagram and TikTok.

Return only the detailed video prompt, no additional text.`;

    console.log("Analyzing images with Gemini...");

    // Convert images to base64 for Gemini analysis
    const imageData = await Promise.all(
      images.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    // Call Gemini API for image analysis
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: imageAnalysisPrompt,
                },
                ...imageData.map((base64) => ({
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64,
                  },
                })),
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const detailedVideoPrompt = geminiData.candidates[0].content.parts[0].text;

    console.log(
      "Gemini analysis complete. Detailed prompt:",
      detailedVideoPrompt
    );

    // Step 2: Generate video with HeyGen AI
    console.log("Generating video with HeyGen AI...");

    const heyGenResponse = await fetch(
      "https://api.heygen.com/v2/video/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": heyGenApiKey,
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: "avatar",
                avatar_id: "Daisy-inskirt-20220818", // Using a default avatar
                avatar_style: "normal",
              },
              voice: {
                type: "text",
                input_text: script,
                voice_id: "2d5b0e6cf36f460aa7fc47e3eee4ba54", // Using a default voice
              },
              background: {
                type: "image",
                image_url: imageData[0]
                  ? `data:image/jpeg;base64,${imageData[0]}`
                  : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
              },
              background_remove: true,
            },
          ],
          dimension: {
            width: 1080,
            height: 1920, // 9:16 aspect ratio for social media
          },
        }),
      }
    );

    if (!heyGenResponse.ok) {
      const errorText = await heyGenResponse.text();
      console.error("HeyGen API Error:", errorText);
      throw new Error(
        `HeyGen API error: ${heyGenResponse.statusText} - ${errorText}`
      );
    }

    const heyGenData = await heyGenResponse.json();
    console.log("HeyGen API Response:", JSON.stringify(heyGenData, null, 2));

    // Check if video generation was successful
    if (heyGenData.data && heyGenData.data.video_id) {
      console.log(
        "Video generation started. Video ID:",
        heyGenData.data.video_id
      );

      // Poll for video completion
      return await pollForHeyGenVideoCompletion(
        heyGenData.data.video_id,
        heyGenApiKey
      );
    } else if (heyGenData.video_id) {
      // Alternative response format
      console.log("Video generation started. Video ID:", heyGenData.video_id);
      return await pollForHeyGenVideoCompletion(
        heyGenData.video_id,
        heyGenApiKey
      );
    } else {
      console.error("Unexpected HeyGen response format:", heyGenData);
      throw new Error("No video ID returned from HeyGen API");
    }
  } catch (error) {
    console.error("Error generating video with HeyGen AI:", error);
    console.error("Error details:", error);
    // Fallback to mock video URL
    return getMockVideoUrl(productName);
  }
}

// Helper function to poll for HeyGen video completion
async function pollForHeyGenVideoCompletion(
  videoId: string,
  apiKey: string
): Promise<string> {
  const maxAttempts = 60; // 10 minutes max
  const pollInterval = 10000; // 10 seconds

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    try {
      const response = await fetch(
        `https://api.heygen.com/v2/video/status.get?video_id=${videoId}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Video status check ${i + 1}/${maxAttempts}:`, data);

        if (data.data && data.data.status === "completed") {
          console.log("Video generation completed!");
          console.log("Video URL:", data.data.video_url);
          return data.data.video_url;
        } else if (data.status === "completed") {
          console.log("Video generation completed!");
          console.log("Video URL:", data.video_url);
          return data.video_url;
        } else if (data.data && data.data.status === "failed") {
          throw new Error(
            `Video generation failed: ${
              data.data.error_message || "Unknown error"
            }`
          );
        } else if (data.status === "failed") {
          throw new Error(
            `Video generation failed: ${data.error_message || "Unknown error"}`
          );
        }
        // Continue polling if status is "processing" or "pending"
      }
    } catch (error) {
      console.error("Error polling video status:", error);
      if (i === maxAttempts - 1) {
        throw new Error("Failed to poll video status");
      }
    }
  }

  throw new Error("Video generation timeout");
}

// Speech-to-text conversion (using Web Speech API)
export async function convertSpeechToText(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      reject(new Error("Speech recognition not supported"));
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();
  });
}

// Image processing utilities
export function processImages(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    })
  );
}

// Content optimization for different platforms
export function optimizeForPlatform(
  content: GeneratedContent,
  platform: "instagram" | "facebook" | "tiktok" | "linkedin"
) {
  switch (platform) {
    case "instagram":
      return {
        caption: content.captions.short,
        hashtags: content.hashtags.slice(0, 10).join(" "),
        maxLength: 100,
      };
    case "facebook":
      return {
        caption: content.captions.medium,
        hashtags: content.hashtags.slice(0, 5).join(" "),
        maxLength: 200,
      };
    case "tiktok":
      return {
        caption: content.captions.short,
        hashtags: content.hashtags.slice(0, 8).join(" "),
        maxLength: 100,
      };
    case "linkedin":
      return {
        caption: content.captions.long,
        hashtags: content.hashtags.slice(0, 3).join(" "),
        maxLength: 400,
      };
    default:
      return {
        caption: content.captions.medium,
        hashtags: content.hashtags.join(" "),
        maxLength: 200,
      };
  }
}

// Helper function for mock response when API keys are not available
function getMockResponse(input: ProductInput): GeneratedContent {
  return {
    captions: {
      short: `✨ Handcrafted ${input.name} by ${input.artisanName} ✨ #Handmade #Artisan`,
      medium: `Discover the beauty of handcrafted ${input.name}! Made with love and traditional techniques by ${input.artisanName}. Each piece tells a story of skill, passion, and cultural heritage. #Handmade #Artisan #Craftsmanship`,
      long: `🌟 Introducing our latest creation: ${input.name} 🌟\n\nCrafted with meticulous attention to detail by the talented ${input.artisanName}, this piece represents the perfect blend of traditional techniques and contemporary design. ${input.description}\n\n${input.artisanBio}\n\nEvery item in our collection is unique, carrying the personal touch and artistic vision of its creator. When you purchase from us, you're not just buying a product - you're supporting local artisans and preserving traditional craftsmanship.\n\n#Handmade #Artisan #Craftsmanship #TraditionalCraft #SupportLocal #UniqueDesign`,
    },
    hashtags: [
      "#Handmade",
      "#Artisan",
      "#Craftsmanship",
      "#TraditionalCraft",
      "#SupportLocal",
      "#UniqueDesign",
      "#Handcrafted",
      "#LocalArtisan",
      "#CraftCulture",
      "#ArtisanMade",
      "#TraditionalSkills",
      "#CulturalHeritage",
      "#SustainableCraft",
      "#ArtisanLife",
      "#HandmadeWithLove",
    ],
    videoScript: `Opening shot: Close-up of artisan's hands working on ${input.name}
Narration: "Meet ${input.artisanName}, a master artisan with years of experience"
Show: Process of creating the product
Narration: "Each piece is carefully crafted using traditional techniques"
Show: Final product from different angles
Narration: "The result? A unique ${input.name} that tells a story"
Call to action: "Support local artisans - shop now!"`,
  };
}

// Helper function for mock video URL when Vertex AI is not available
function getMockVideoUrl(productName: string): string {
  return `https://example.com/generated-videos/${productName
    .replace(/\s+/g, "-")
    .toLowerCase()}-${Date.now()}.mp4`;
}
