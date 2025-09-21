
'use client';

import type { ContentPiece, Artisan } from '@/lib/data';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, Bookmark, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PopulatedContentPiece = ContentPiece & { artisan: Artisan };

export function ArtisanReel({ reel }: { reel: PopulatedContentPiece }) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [isSaved, setIsSaved] = useState(reel.isSaved);
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: 'Contact Artisan',
      description: 'This feature is coming soon!',
    });
  };
  
  const handleViewProduct = () => {
    toast({
      title: 'View Product',
      description: 'This feature is coming soon!',
    });
  };

  const handleBuyNow = () => {
    toast({
      title: 'Buy Now',
      description: 'This feature is coming soon!',
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Link href={`/profile/${reel.artisan.id}`}>
          <Avatar>
            <AvatarImage src={reel.artisan.profile_photo_url} alt={reel.artisan.name} />
            <AvatarFallback>{reel.artisan.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${reel.artisan.id}`} className="font-semibold hover:underline">
            {reel.artisan.name}
          </Link>
          <p className="text-sm text-muted-foreground">{reel.artisan.art_form}</p>
        </div>
        <Button size="sm" variant="outline">Follow</Button>
      </CardHeader>
      <CardContent className="p-0 relative aspect-[3/4]">
        <Image
          src={reel.media_url}
          alt={reel.caption}
          fill
          className="w-full h-full object-cover"
          data-ai-hint={reel.media_hint}
        />
        {reel.artwork && (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="absolute bottom-4 left-4 h-auto p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        <span className="font-semibold">${reel.artwork.price}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="justify-start" onClick={handleViewProduct}>
                            <ArrowRight className="mr-2 h-4 w-4" /> View Product
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={handleBuyNow}>
                            <ArrowRight className="mr-2 h-4 w-4" /> Buy Now
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-[#800080] text-[#800080]' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`w-5 h-5 transition-colors ${isSaved ? 'fill-accent text-accent' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/30 text-white hover:bg-black/50"
onClick={handleContact}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start">
        <p className="text-sm font-medium">{reel.likes.toLocaleString()} likes</p>
        <p className="text-sm">
          <Link href={`/profile/${reel.artisan.id}`} className="font-semibold hover:underline">
            {reel.artisan.name}
          </Link>{' '}
          {reel.caption}
        </p>
      </CardFooter>
    </Card>
  );
}
