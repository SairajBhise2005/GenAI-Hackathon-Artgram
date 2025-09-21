'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateCaptionAction, suggestMusicAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Wand2, FileUp, Music, Info } from 'lucide-react';
import Image from 'next/image';

function SubmitButton({ children, icon: Icon, ...props }: { children: React.ReactNode, icon: React.ElementType } & React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon className="mr-2 h-4 w-4" />}
      {children}
    </Button>
  );
}

export function UploadWizard() {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  
  const [captionState, captionAction] = useFormState(generateCaptionAction, { message: '' });
  const [musicState, musicAction] = useFormState(suggestMusicAction, { message: '' });

  useEffect(() => {
    if(captionState.caption) {
        setCaption(captionState.caption);
    }
  }, [captionState.caption]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mediaFile || !mediaPreview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Media</CardTitle>
          <CardDescription>Select a video or image file to start.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-muted-foreground">Video or image files</p>
              </div>
              <Input id="file-upload" type="file" className="hidden" accept="video/*,image/*" onChange={handleFileChange} />
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-8">
        {/* Caption Generator */}
        <Card>
          <form action={captionAction}>
            <CardHeader>
              <CardTitle className="flex items-center"><Wand2 className="mr-2 text-primary" /> AI Caption Generator</CardTitle>
              <CardDescription>Let AI write a captivating caption for your reel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="mediaDataUri" value={mediaPreview} />
              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Keywords</Label>
                <Input id="topic" name="topic" placeholder="e.g., 'Handmade ceramic mug', 'morning coffee'" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <SubmitButton icon={Sparkles}>Generate Caption</SubmitButton>
              {captionState.error && <Alert variant="destructive"><Info className="h-4 w-4" /><AlertDescription>{captionState.error}</AlertDescription></Alert>}
            </CardFooter>
          </form>
        </Card>
        
        {/* Music Suggester */}
        <Card>
            <form action={musicAction}>
                <CardHeader>
                <CardTitle className="flex items-center"><Music className="mr-2 text-primary" /> AI Music Suggestions</CardTitle>
                <CardDescription>Get background music ideas that match your reel's vibe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reelDescription">Reel Description</Label>
                    <Textarea id="reelDescription" name="reelDescription" placeholder="Describe the scene and mood of your reel." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="artForm">Art Form</Label>
                    <Input id="artForm" name="artForm" placeholder="e.g., 'Pottery', 'Woodworking'" required />
                </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                <SubmitButton icon={Sparkles}>Suggest Music</SubmitButton>
                 {musicState.error && <Alert variant="destructive"><Info className="h-4 w-4" /><AlertDescription>{musicState.error}</AlertDescription></Alert>}
                </CardFooter>
            </form>
        </Card>

      </div>
      
      {/* Preview and Results */}
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Step 2: Edit & Refine</CardTitle>
          <CardDescription>Your reel is coming together. Review and publish.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-[3/4] rounded-md overflow-hidden bg-secondary relative">
            <Image src={mediaPreview} alt="Media preview" layout="fill" objectFit="cover" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} rows={4} placeholder="Your generated caption will appear here..." />
          </div>

          {musicState.suggestedMusic && (
             <div>
                <Label>Suggested Music</Label>
                <Alert>
                  <AlertTitle>Music Ideas</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                        {musicState.suggestedMusic.map((track, i) => <li key={i}>{track}</li>)}
                    </ul>
                    <p className="mt-2 text-xs">{musicState.reasoning}</p>
                  </AlertDescription>
                </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button size="lg">Publish Reel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
