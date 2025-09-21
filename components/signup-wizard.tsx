"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Palette,
  Upload,
  UserCog,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Home,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUpAction } from "@/lib/auth";
import { type AuthState } from "@/lib/auth-types";
import Image from "next/image";
import Link from "next/link";

type UserType = "customer" | "artisan";

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      <span className="text-xs font-medium text-muted-foreground">{`${currentStep}/${totalSteps}`}</span>
    </div>
  );
}

function CustomerSignupForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState<AuthState>({ message: "" });

  const handleSubmit = (formData: FormData) => {
    formData.append("userType", "customer");
    startTransition(async () => {
      const result = await signUpAction(state, formData);
      setState(result);

      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Welcome! You can now browse and connect with artisans.",
        });
        setTimeout(() => {
          window.location.href = "/signin";
        }, 1000);
      } else if (result.error) {
        toast({
          title: "Sign up failed",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your Customer Account</CardTitle>
        <CardDescription>
          Join our community to discover and support artisans.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your Name"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isPending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isPending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isPending}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" asChild disabled={isPending}>
            <Link href="/">
              <Home className="mr-2" /> Home
            </Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function ArtisanSignupForm() {
  const [step, setStep] = useState(1);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState<AuthState>({ message: "" });
  const { toast } = useToast();

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const totalSteps = 4;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPortfolioFiles(Array.from(event.target.files).slice(0, 3));
    }
  };

  const handleFinalSubmit = (formData: FormData) => {
    formData.append("userType", "artisan");
    startTransition(async () => {
      const result = await signUpAction(state, formData);
      setState(result);

      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Welcome! Your artisan profile is now live.",
        });
        setTimeout(() => {
          window.location.href = "/signin";
        }, 1000);
      } else if (result.error) {
        toast({
          title: "Sign up failed",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Account Setup
        return (
          <Card>
            <CardHeader>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
              <CardTitle className="flex items-center">
                <User className="mr-2 text-primary" /> Account Setup
              </CardTitle>
              <CardDescription>Let's start with the basics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="artisan-name">Name</Label>
                <Input
                  id="artisan-name"
                  name="name"
                  placeholder="Your Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artisan-email">Email</Label>
                <Input
                  id="artisan-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artisan-password">Password</Label>
                <div className="relative">
                  <Input
                    id="artisan-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="artisan-confirm-password">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="artisan-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep}>
                Next <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      case 2: // Craft Information
        return (
          <Card>
            <CardHeader>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
              <CardTitle className="flex items-center">
                <Palette className="mr-2 text-primary" /> Your Craft
              </CardTitle>
              <CardDescription>
                Tell us about your artistic journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Art Form</Label>
                <Select name="art_form">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your art form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="weaving">Weaving</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="woodwork">Woodwork</SelectItem>
                    <SelectItem value="metalcraft">Metal Craft</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="years-practice">Years of Practice</Label>
                <Input
                  id="years-practice"
                  name="years_practicing"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="space-y-2">
                <Label>How did you learn this craft?</Label>
                <RadioGroup
                  defaultValue="self-taught"
                  name="training_background"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Family Tradition" id="r1" />
                    <Label htmlFor="r1">Family Tradition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Self-taught" id="r2" />
                    <Label htmlFor="r2">Self-taught</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Formal Training" id="r3" />
                    <Label htmlFor="r3">Formal Training</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Apprenticeship" id="r4" />
                    <Label htmlFor="r4">Apprenticeship</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              <Button onClick={nextStep}>
                Next <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      case 3: // Portfolio Upload
        return (
          <Card>
            <CardHeader>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
              <CardTitle className="flex items-center">
                <Upload className="mr-2 text-primary" /> Showcase Your Work
              </CardTitle>
              <CardDescription>
                Upload 1-3 photos or videos of your best work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label
                htmlFor="portfolio-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Photos or videos (up to 3 files)
                  </p>
                </div>
                <Input
                  id="portfolio-upload"
                  name="portfolio_files"
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </Label>
              {portfolioFiles.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Selected files:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {portfolioFiles.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="intro-video">
                  (Optional) Introduction Video/Audio
                </Label>
                <Input
                  id="intro-video"
                  name="intro_video"
                  type="file"
                  accept="video/*,audio/*"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              <Button onClick={nextStep}>
                Next <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      case 4: // Profile Details
        return (
          <Card>
            <CardHeader>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
              <CardTitle className="flex items-center">
                <UserCog className="mr-2 text-primary" /> Profile Details
              </CardTitle>
              <CardDescription>
                Help customers get to know you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell your story, what inspires you, and what makes your craft unique."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Jaipur, Rajasthan, India"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Preferences</Label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="whatsapp" name="contact_whatsapp" />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="phone" name="contact_phone" />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-contact" name="contact_email" />
                    <Label htmlFor="email-contact">Email</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              <Button onClick={nextStep}>
                Review & Submit <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      case 4: // Review & Submit
        return (
          <Card>
            <CardHeader>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 text-primary" /> Review & Submit
              </CardTitle>
              <CardDescription>
                Look over your profile. Everything correct?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              <h3 className="font-semibold text-lg">
                Your Artisan Profile Preview
              </h3>
              <div className="p-4 border rounded-lg space-y-3 bg-secondary/50">
                <p>
                  <strong className="text-muted-foreground">Name:</strong> Your
                  Name
                </p>
                <p>
                  <strong className="text-muted-foreground">Art Form:</strong>{" "}
                  Pottery
                </p>
                <p>
                  <strong className="text-muted-foreground">Bio:</strong> Your
                  inspiring bio will appear here.
                </p>
                <p>
                  <strong className="text-muted-foreground">Location:</strong>{" "}
                  Jaipur, Rajasthan, India
                </p>
                <div>
                  <strong className="text-muted-foreground">Portfolio:</strong>
                  <div className="flex gap-2 mt-1">
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                      Sample 1
                    </div>
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                      Sample 2
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isPending}>
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              <form action={handleFinalSubmit}>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Confirm & Create Account"
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
}

export function SignupWizard() {
  const [userType, setUserType] = useState<UserType | null>(null);

  if (!userType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>How will you be joining us?</CardTitle>
          <CardDescription>Choose your role to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 text-lg"
            onClick={() => setUserType("customer")}
          >
            I'm a Customer
          </Button>
          <Button
            variant="outline"
            className="h-24 text-lg"
            onClick={() => setUserType("artisan")}
          >
            🧵 I'm an Artisan
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (userType === "customer") {
    return <CustomerSignupForm />;
  }

  return <ArtisanSignupForm />;
}
