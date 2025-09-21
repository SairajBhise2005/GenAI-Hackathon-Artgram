import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Wand2,
  Calendar,
  BarChart3,
  Mic,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered Social Media for Artisans
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ArtisanAI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your artisan products into engaging social media content
            with AI. Generate captions, create videos, and schedule posts across
            platforms - all powered by advanced AI technology.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">
                Create Content
                <Wand2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Join as Artisan</Link>
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>1. Describe Your Product</CardTitle>
                <CardDescription>
                  Use speech-to-text or type to describe your artisan product,
                  upload photos, and tell your story.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Wand2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>2. AI Generates Content</CardTitle>
                <CardDescription>
                  Our AI creates engaging captions, hashtags, and even generates
                  eye-catching product videos automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>3. Schedule & Share</CardTitle>
                <CardDescription>
                  Schedule your content across Instagram, Facebook, TikTok, and
                  LinkedIn with one click.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Speech-to-Text</CardTitle>
              <CardDescription>
                Describe your products naturally using voice input
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">AI Content</CardTitle>
              <CardDescription>
                Generate captions, hashtags, and video scripts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Video Creation</CardTitle>
              <CardDescription>
                Create engaging product videos automatically
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                Track performance and grow your reach
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Platform Support */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Supported Platforms
          </h2>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <span className="text-2xl">📷</span>
              <span className="font-medium">Instagram</span>
            </div>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <span className="text-2xl">📘</span>
              <span className="font-medium">Facebook</span>
            </div>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <span className="text-2xl">🎵</span>
              <span className="font-medium">TikTok</span>
            </div>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <span className="text-2xl">💼</span>
              <span className="font-medium">LinkedIn</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Artisan Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join artisans who are already increasing their reach with AI-powered
            social media content.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/create">
                Start Creating
                <Wand2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
              asChild
            >
              <Link href="/signup">
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
