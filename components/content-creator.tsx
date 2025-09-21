"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Upload,
  Wand2,
  Play,
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  generateContentWithGemini,
  generateVideoWithHeyGen,
  convertSpeechToText,
  processImages,
  type ProductInput,
  type GeneratedContent,
} from "@/lib/ai-services";
import { saveGeneratedContent } from "@/lib/data-services";
import { generateVideoAction } from "@/lib/video-actions";

export function ContentCreator() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [artisanName, setArtisanName] = useState("");
  const [artisanBio, setArtisanBio] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  // AI generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setVideos((prev) => [...prev, ...files]);
  };

  const handleSpeechToText = async () => {
    try {
      setIsRecording(true);
      const transcript = await convertSpeechToText();
      setDescription(transcript);
      toast({
        title: "Speech converted!",
        description: "Your speech has been converted to text.",
      });
    } catch (error) {
      toast({
        title: "Speech recognition failed",
        description: "Please try again or type your description manually.",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!productName || !description || !artisanName || images.length === 0) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all required fields and upload at least one image.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const productInput: ProductInput = {
        name: productName,
        description,
        images,
        videos,
        artisanName,
        artisanBio,
        price: price ? parseFloat(price) : undefined,
        category,
      };

      const content = await generateContentWithGemini(productInput);
      setGeneratedContent(content);

      // Save generated content to database
      await saveContentToDatabase(content);

      toast({
        title: "Content generated!",
        description: "AI has created engaging content for your product.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContentToDatabase = async (content: GeneratedContent) => {
    try {
      // For now, we'll use a mock product ID since we don't have a product created yet
      // In a real app, you'd create the product first, then generate content
      const mockProductId = "temp-product-id";
      const mockArtisanId = "temp-artisan-id";

      // Save captions for different platforms
      const platforms = [
        "instagram",
        "facebook",
        "tiktok",
        "linkedin",
      ] as const;

      for (const platform of platforms) {
        // Save short caption
        await saveGeneratedContent({
          product_id: mockProductId,
          artisan_id: mockArtisanId,
          content_type: "caption",
          platform,
          content:
            platform === "instagram"
              ? content.captions.short
              : platform === "facebook"
              ? content.captions.medium
              : content.captions.short,
          ai_model_used: "gemini",
          generation_prompt: `Generate ${platform} caption for ${productName}`,
        });

        // Save hashtags
        await saveGeneratedContent({
          product_id: mockProductId,
          artisan_id: mockArtisanId,
          content_type: "hashtags",
          platform,
          content: content.hashtags.join(" "),
          ai_model_used: "gemini",
          generation_prompt: `Generate ${platform} hashtags for ${productName}`,
        });
      }

      // Save video script
      if (content.videoScript) {
        await saveGeneratedContent({
          product_id: mockProductId,
          artisan_id: mockArtisanId,
          content_type: "video_script",
          platform: "instagram", // Default platform for video script
          content: content.videoScript,
          ai_model_used: "gemini",
          generation_prompt: `Generate video script for ${productName}`,
        });
      }

      console.log("Content saved to database successfully");
    } catch (error) {
      console.error("Error saving content to database:", error);
    }
  };

  const handleGenerateVideo = async () => {
    if (!generatedContent || images.length === 0) {
      toast({
        title: "Missing content",
        description:
          "Please generate content first and ensure you have images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Starting video generation...");
      console.log("Images count:", images.length);
      console.log("Product name:", productName);
      console.log("Script:", generatedContent.videoScript);

      const result = await generateVideoAction(
        images,
        generatedContent.videoScript || "",
        productName
      );

      if (result.success && result.videoUrl) {
        console.log("Video generation completed. URL:", result.videoUrl);
        setGeneratedVideoUrl(result.videoUrl);

        toast({
          title: "Video generated!",
          description: "Your product video is ready for social media.",
        });
      } else {
        throw new Error(result.error || "Video generation failed");
      }
    } catch (error) {
      console.error("Video generation error:", error);
      toast({
        title: "Video generation failed",
        description: `Failed to generate video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set(prev).add(type));
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(type);
          return newSet;
        });
      }, 2000);

      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Content Creator</h1>
        <p className="text-muted-foreground">
          Transform your artisan products into engaging social media content
          with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Tell us about your product and we'll create amazing content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Handwoven Cotton Scarf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artisanName">Your Name *</Label>
              <Input
                id="artisanName"
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                placeholder="e.g., Priya Sharma"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="textiles">Textiles & Weaving</SelectItem>
                  <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                  <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                  <SelectItem value="woodwork">Woodwork & Carving</SelectItem>
                  <SelectItem value="metalwork">Metalwork & Forging</SelectItem>
                  <SelectItem value="painting">Painting & Art</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Optional)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 1500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description *</Label>
              <div className="flex gap-2">
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product, its story, materials used, techniques..."
                  rows={4}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSpeechToText}
                  disabled={isRecording}
                  className="self-start"
                >
                  {isRecording ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the mic icon to record your description
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="artisanBio">Your Story (Optional)</Label>
              <Textarea
                id="artisanBio"
                value={artisanBio}
                onChange={(e) => setArtisanBio(e.target.value)}
                placeholder="Tell us about yourself, your journey, your craft..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Product Images *</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {images.length > 0 && (
                  <Badge variant="secondary">{images.length} images</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Videos (Optional)</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Upload Videos
                </Button>
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                {videos.length > 0 && (
                  <Badge variant="secondary">{videos.length} videos</Badge>
                )}
              </div>
            </div>

            <Button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate AI Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generated Content
            </CardTitle>
            <CardDescription>
              AI-generated content ready for social media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating content...</span>
                </div>
                <Progress value={66} className="w-full" />
              </div>
            )}

            {generatedContent && (
              <div className="space-y-4">
                {/* Short Caption */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Instagram/TikTok Caption
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          generatedContent.captions.short,
                          "short-caption"
                        )
                      }
                    >
                      {copiedItems.has("short-caption") ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {generatedContent.captions.short}
                  </div>
                </div>

                {/* Medium Caption */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Facebook/LinkedIn Caption
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          generatedContent.captions.medium,
                          "medium-caption"
                        )
                      }
                    >
                      {copiedItems.has("medium-caption") ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {generatedContent.captions.medium}
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Hashtags</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          generatedContent.hashtags.join(" "),
                          "hashtags"
                        )
                      }
                    >
                      {copiedItems.has("hashtags") ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedContent.hashtags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Video Generation */}
                <div className="space-y-2">
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGenerating}
                    className="w-full"
                    variant="outline"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Generate Product Video
                      </>
                    )}
                  </Button>
                </div>

                {generatedVideoUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Generated Video
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground mb-2">
                        Video URL: {generatedVideoUrl}
                      </p>
                      <video
                        src={generatedVideoUrl}
                        controls
                        className="w-full rounded"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(generatedVideoUrl, "_blank")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(generatedVideoUrl, "video-url")
                        }
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Link
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!generatedContent && !isGenerating && (
              <div className="text-center py-8 text-muted-foreground">
                <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  Fill in the product information and click "Generate AI
                  Content" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
