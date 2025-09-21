
import { artisans, contentPieces } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const artisan = artisans.find((a) => a.id === params.id);
  if (!artisan) {
    notFound();
  }

  const artisanReels = contentPieces.filter((r) => r.artisan_id === artisan.id);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
        <Avatar className="w-32 h-32 border-4 border-background shadow-md">
          <AvatarImage src={artisan.profile_photo_url} alt={artisan.name} data-ai-hint={artisan.profile_photo_hint} />
          <AvatarFallback className="text-4xl">{artisan.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{artisan.name}</h1>
          <p className="text-primary font-semibold">{artisan.art_form}</p>
          <p className="mt-2 text-muted-foreground">{artisan.bio}</p>
          <div className="mt-4 flex justify-center md:justify-start space-x-2">
            <Button>Follow</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Creations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {artisanReels.map((reel) => (
            <Link href="#" key={reel.id}>
              <Card className="overflow-hidden group aspect-[3/4] relative">
                <Image
                  src={reel.media_url}
                  alt={reel.caption}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={reel.media_hint}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
