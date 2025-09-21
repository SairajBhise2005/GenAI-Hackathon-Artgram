
import { ArtisanReel } from '@/components/artisan-reel';
import { contentPieces, artisans } from '@/lib/data';

export default function FeedPage() {
  const populatedReels = contentPieces.map((reel) => {
    const artisan = artisans.find((a) => a.id === reel.artisan_id);
    if (!artisan) return null;
    return { ...reel, artisan };
  }).filter(Boolean);

  return (
    <div className="container mx-auto max-w-lg py-8">
      <div className="flex flex-col space-y-12">
        {populatedReels.map((reel) => (
          reel && <ArtisanReel key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
}
