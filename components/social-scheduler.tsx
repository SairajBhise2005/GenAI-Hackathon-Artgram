"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Instagram,
  Facebook,
  MessageCircle,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  status: "scheduled" | "published" | "failed";
  productName: string;
}

export function SocialScheduler() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-100 text-pink-800",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: MessageCircle,
      color: "bg-black text-white",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = () => {
    if (!date || !time || !content || selectedPlatforms.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const scheduledDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      platforms: selectedPlatforms,
      scheduledDate: scheduledDateTime,
      status: "scheduled",
      productName: productName || "Untitled Product",
    };

    setScheduledPosts((prev) => [...prev, newPost]);

    // Reset form
    setDate(undefined);
    setTime("");
    setContent("");
    setSelectedPlatforms([]);
    setProductName("");

    toast({
      title: "Post scheduled!",
      description: `Your post has been scheduled for ${format(
        scheduledDateTime,
        "PPP p"
      )}`,
    });
  };

  const handleDeletePost = (postId: string) => {
    setScheduledPosts((prev) => prev.filter((post) => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "The scheduled post has been removed.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Media Scheduler</h1>
        <p className="text-muted-foreground">
          Schedule your content across multiple platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule New Post */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Schedule New Post
            </CardTitle>
            <CardDescription>
              Create and schedule content for your social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Handwoven Cotton Scarf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Platforms *</Label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => handlePlatformToggle(platform.id)}
                      />
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {platform.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSchedulePost} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>
          </CardContent>
        </Card>

        {/* Scheduled Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Scheduled Posts
            </CardTitle>
            <CardDescription>Manage your scheduled content</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled posts yet</p>
                <p className="text-sm">
                  Create your first scheduled post to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(post.status)}
                        <span className="font-medium">{post.productName}</span>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        {post.platforms.map((platformId) => {
                          const platform = platforms.find(
                            (p) => p.id === platformId
                          );
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return (
                            <div
                              key={platformId}
                              className="flex items-center gap-1"
                            >
                              <Icon className="h-3 w-3" />
                              <span className="text-xs">{platform.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-muted-foreground">
                        {format(post.scheduledDate, "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Integrations</CardTitle>
          <CardDescription>
            Connect your social media accounts to enable automatic posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Not Connected
                    </Badge>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Platform integrations are coming soon! For now, you can copy your
              scheduled content and post manually.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
