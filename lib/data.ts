
import { PlaceHolderImages } from './placeholder-images';

// Based on your Supabase schema

export type UserRole = 'artisan' | 'customer' | 'editor' | 'admin';

export type User = {
  id: string; // Supabase Auth user id
  role: UserRole;
  artisan_id?: string;
  customer_id?: string;
  created_at: string;
};

export type Artisan = {
  id: string; // references users.artisan_id
  name: string;
  bio?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    whatsapp?: boolean;
  };
  location?: string;
  skills?: string[];
  art_form?: string;
  years_practicing?: number;
  training_background?: string;
  profile_photo_url?: string;
  profile_photo_hint?: string;
  intro_video_url?: string;
  created_at: string;
};

export type Customer = {
  id: string; // references users.customer_id
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  preferences?: string[];
  created_at: string;
};

export type Artwork = {
    id: string;
    artisan_id: string;
    title: string;
    price: number;
};

export type ContentPiece = {
  id: string;
  artisan_id: string;
  artwork?: Artwork;
  type: 'blog' | 'short_video' | 'social_post';
  transcript?: string;
  ai_generated_copy?: string;
  status: 'draft' | 'review' | 'published';
  published_at?: string;
  created_at: string;

  // For UI display, we'll populate these
  media_url: string;
  media_hint: string;
  likes: number; // This would likely be calculated from a 'likes' table
  isLiked: boolean;
  isSaved: boolean;
  caption: string;
};


const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return {
        url: img?.imageUrl ?? 'https://picsum.photos/seed/placeholder/400/600',
        hint: img?.imageHint ?? 'placeholder'
    }
}

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Elena Vance',
    art_form: 'Pottery',
    bio: 'Crafting timeless ceramic pieces from the heart of the earth. Each form tells a story of patience and passion.',
    profile_photo_url: getImage('artisan-1').url,
    profile_photo_hint: getImage('artisan-1').hint,
    created_at: new Date().toISOString(),
    years_practicing: 10,
    location: "Jaipur, Rajasthan, India",
    skills: ["pottery", "glazing"],
    training_background: "Formal Training"
  },
  {
    id: 'artisan-2',
    name: 'Marcus Thorne',
    art_form: 'Woodworking',
    bio: 'Breathing new life into reclaimed wood. My work explores the intersection of natural beauty and functional design.',
    profile_photo_url: getImage('artisan-2').url,
    profile_photo_hint: getImage('artisan-2').hint,
    created_at: new Date().toISOString(),
    years_practicing: 15,
    location: "Asheville, North Carolina, USA",
    skills: ["carving", "joinery"],
    training_background: "Apprenticeship"
  },
  {
    id: 'artisan-3',
    name: 'Aria Chen',
    art_form: 'Painting',
    bio: 'An abstract expressionist who uses vibrant colors and bold strokes to capture emotions and moments in time.',
    profile_photo_url: getImage('artisan-3').url,
    profile_photo_hint: getImage('artisan-3').hint,
    created_at: new Date().toISOString(),
    years_practicing: 8,
    location: "Kyoto, Japan",
    skills: ["oil painting", "mixed media"],
    training_background: "Self-taught"
  },
];

const artworks: Artwork[] = [
    { id: 'artwork-1', artisan_id: 'artisan-1', title: 'Ceramic Mug', price: 35 },
    { id: 'artwork-2', artisan_id: 'artisan-2', title: 'Carved Wooden Bowl', price: 120 },
];

export const contentPieces: ContentPiece[] = [
  {
    id: '101',
    artisan_id: 'artisan-1',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-1').url,
    media_hint: getImage('reel-1').hint,
    caption: 'The gentle rhythm of the wheel. Shaping a new vessel from a simple lump of clay.',
    likes: 1302,
    isLiked: false,
    isSaved: false,
    created_at: new Date().toISOString(),
    artwork: artworks[0],
  },
  {
    id: '102',
    artisan_id: 'artisan-2',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-2').url,
    media_hint: getImage('reel-2').hint,
    caption: 'Discovering the story within the grain. Every curl of the carving knife reveals a new chapter.',
    likes: 2450,
    isLiked: true,
    isSaved: false,
    created_at: new Date().toISOString(),
    artwork: artworks[1],
  },
  {
    id: '103',
    artisan_id: 'artisan-3',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-3').url,
    media_hint: getImage('reel-3').hint,
    caption: 'A dance of color on canvas. Building layers to create depth and feeling.',
    likes: 567,
    isLiked: false,
    isSaved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '104',
    artisan_id: 'artisan-1',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-4').url,
    media_hint: getImage('reel-4').hint,
    caption: 'Fresh from the kiln! The final glaze reveals its true colors. So happy with how this bowl turned out.',
    likes: 985,
    isLiked: false,
    isSaved: false,
    created_at: new Date().toISOString(),
  },
    {
    id: '105',
    artisan_id: 'artisan-2',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-5').url,
    media_hint: getImage('reel-5').hint,
    caption: 'The final details make all the difference. Sanding and oiling this piece to perfection.',
    likes: 1890,
    isLiked: false,
    isSaved: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '106',
    artisan_id: 'artisan-3',
    type: 'short_video',
    status: 'published',
    media_url: getImage('reel-6').url,
    media_hint: getImage('reel-6').hint,
    caption: 'Sometimes you just have to let the paint speak for itself. An exploration in texture and movement.',
    likes: 812,
    isLiked: true,
    isSaved: true,
    created_at: new Date().toISOString(),
  },
];
