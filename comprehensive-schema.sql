-- =====================================================
-- COMPREHENSIVE ARTISAN REELS DATABASE SCHEMA
-- =====================================================
-- This schema captures everything from both artisans and customers
-- including products, content generation, analytics, and more

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE USER MANAGEMENT
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.content_analytics CASCADE;
DROP TABLE IF EXISTS public.scheduled_posts CASCADE;
DROP TABLE IF EXISTS public.generated_content CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.artisan_categories CASCADE;
DROP TABLE IF EXISTS public.customer_preferences CASCADE;
DROP TABLE IF EXISTS public.artisans CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table (base table for all users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'artisan')),
  phone TEXT,
  profile_image_url TEXT,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  social_media JSONB DEFAULT '{}', -- Instagram, Facebook, TikTok, LinkedIn URLs
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARTISAN-SPECIFIC TABLES
-- =====================================================

-- Artisan categories/specializations
CREATE TABLE public.artisan_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisans table (extends users for artisan-specific data)
CREATE TABLE public.artisans (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  business_type TEXT, -- 'individual', 'studio', 'cooperative', 'company'
  art_form TEXT NOT NULL,
  category_id UUID REFERENCES public.artisan_categories(id),
  years_practicing INTEGER DEFAULT 0,
  training_background TEXT,
  certifications JSONB DEFAULT '[]', -- Array of certification objects
  awards JSONB DEFAULT '[]', -- Array of award objects
  languages_spoken TEXT[] DEFAULT '{}',
  availability_schedule JSONB DEFAULT '{}', -- Weekly schedule
  service_radius INTEGER, -- In kilometers
  pricing_info JSONB DEFAULT '{}', -- Pricing structure
  payment_methods TEXT[] DEFAULT '{}', -- Accepted payment methods
  portfolio_files JSONB DEFAULT '[]', -- Array of portfolio file objects
  intro_video_url TEXT,
  gallery_images JSONB DEFAULT '[]', -- Array of gallery image objects
  workshop_offered BOOLEAN DEFAULT FALSE,
  workshop_details JSONB DEFAULT '{}',
  custom_orders_accepted BOOLEAN DEFAULT TRUE,
  custom_order_lead_time INTEGER, -- In days
  shipping_info JSONB DEFAULT '{}',
  return_policy TEXT,
  contact_preferences JSONB DEFAULT '{}', -- WhatsApp, phone, email preferences
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CUSTOMER-SPECIFIC TABLES
-- =====================================================

-- Customer preferences and interests
CREATE TABLE public.customer_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_art_forms TEXT[] DEFAULT '{}',
  preferred_categories TEXT[] DEFAULT '{}',
  budget_range JSONB DEFAULT '{}', -- Min and max price range
  location_preference TEXT,
  preferred_artisan_ratings DECIMAL(3,2) DEFAULT 0.0,
  notification_preferences JSONB DEFAULT '{}',
  marketing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (extends users for customer-specific data)
CREATE TABLE public.customers (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT,
  occupation TEXT,
  interests TEXT[] DEFAULT '{}',
  favorite_artisans UUID[] DEFAULT '{}', -- Array of artisan IDs
  wishlist JSONB DEFAULT '[]', -- Array of product IDs
  order_history JSONB DEFAULT '[]', -- Array of order objects
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.0,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS AND CONTENT
-- =====================================================

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  dimensions JSONB DEFAULT '{}', -- Length, width, height
  weight DECIMAL(8,2),
  materials TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]', -- Array of image objects with URLs and metadata
  videos JSONB DEFAULT '[]', -- Array of video objects
  tags TEXT[] DEFAULT '{}',
  is_customizable BOOLEAN DEFAULT FALSE,
  customization_options JSONB DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_digital BOOLEAN DEFAULT FALSE,
  digital_delivery_method TEXT,
  shipping_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content table (AI-generated content for products)
CREATE TABLE public.generated_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('caption', 'hashtags', 'video_script', 'video', 'image')),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'linkedin', 'twitter', 'youtube')),
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional content metadata
  ai_model_used TEXT, -- Gemini, Veo3, etc.
  generation_prompt TEXT,
  generation_settings JSONB DEFAULT '{}',
  file_url TEXT, -- For generated videos/images
  file_size INTEGER, -- In bytes
  duration INTEGER, -- For videos, in seconds
  dimensions JSONB DEFAULT '{}', -- Width, height for images/videos
  is_approved BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  performance_metrics JSONB DEFAULT '{}', -- Views, likes, shares, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled posts table
CREATE TABLE public.scheduled_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'linkedin', 'twitter', 'youtube')),
  post_type TEXT NOT NULL CHECK (post_type IN ('image', 'video', 'carousel', 'story', 'reel')),
  content_data JSONB NOT NULL, -- The actual post content
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  platform_post_id TEXT, -- ID returned by platform API
  error_message TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS AND PERFORMANCE
-- =====================================================

-- Content analytics table
CREATE TABLE public.content_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('view', 'like', 'share', 'comment', 'save', 'click', 'impression')),
  metric_value INTEGER DEFAULT 1,
  date_recorded DATE DEFAULT CURRENT_DATE,
  hour_recorded INTEGER DEFAULT EXTRACT(HOUR FROM NOW()),
  demographics JSONB DEFAULT '{}', -- Age, gender, location breakdown
  device_info JSONB DEFAULT '{}', -- Mobile, desktop, etc.
  source JSONB DEFAULT '{}', -- Organic, paid, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDERS AND TRANSACTIONS
-- =====================================================

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  shipping_method TEXT,
  shipping_cost DECIMAL(10,2) DEFAULT 0.0,
  tax_amount DECIMAL(10,2) DEFAULT 0.0,
  discount_amount DECIMAL(10,2) DEFAULT 0.0,
  notes TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customization_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MESSAGING AND COMMUNICATION
-- =====================================================

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  conversation_id UUID,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'product_share')),
  content TEXT,
  file_url TEXT,
  file_metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEWS AND RATINGS
-- =====================================================

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images JSONB DEFAULT '[]',
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'message', 'content', 'system', 'marketing')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Artisans policies
CREATE POLICY "Artisans can view their own profile" ON public.artisans
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Artisans can update their own profile" ON public.artisans
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Artisans can insert their own profile" ON public.artisans
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public artisan profiles" ON public.artisans
  FOR SELECT USING (true);

-- Customers policies
CREATE POLICY "Customers can view their own profile" ON public.customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update their own profile" ON public.customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can insert their own profile" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Artisans can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = artisan_id);

-- Generated content policies
CREATE POLICY "Artisans can manage their own content" ON public.generated_content
  FOR ALL USING (auth.uid() = artisan_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = artisan_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON public.reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Customers can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, name, email, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  );

  -- Insert into appropriate role-specific table
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'artisan' THEN
    INSERT INTO public.artisans (id)
    VALUES (NEW.id);
  ELSE
    INSERT INTO public.customers (id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'AR' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artisans_updated_at
  BEFORE UPDATE ON public.artisans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at
  BEFORE UPDATE ON public.generated_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-generate order number
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Artisan indexes
CREATE INDEX idx_artisans_art_form ON public.artisans(art_form);
CREATE INDEX idx_artisans_category_id ON public.artisans(category_id);
CREATE INDEX idx_artisans_rating ON public.artisans(rating);
CREATE INDEX idx_artisans_is_featured ON public.artisans(is_featured);

-- Product indexes
CREATE INDEX idx_products_artisan_id ON public.products(artisan_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_created_at ON public.products(created_at);

-- Content indexes
CREATE INDEX idx_generated_content_product_id ON public.generated_content(product_id);
CREATE INDEX idx_generated_content_artisan_id ON public.generated_content(artisan_id);
CREATE INDEX idx_generated_content_platform ON public.generated_content(platform);
CREATE INDEX idx_generated_content_created_at ON public.generated_content(created_at);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_artisan_id ON public.orders(artisan_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Message indexes
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Analytics indexes
CREATE INDEX idx_content_analytics_content_id ON public.content_analytics(content_id);
CREATE INDEX idx_content_analytics_date_recorded ON public.content_analytics(date_recorded);
CREATE INDEX idx_content_analytics_metric_type ON public.content_analytics(metric_type);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample artisan categories
INSERT INTO public.artisan_categories (name, description, icon_url) VALUES
('Pottery & Ceramics', 'Handcrafted pottery, ceramics, and clay works', 'https://example.com/icons/pottery.svg'),
('Textiles & Weaving', 'Handwoven fabrics, rugs, and textile art', 'https://example.com/icons/textiles.svg'),
('Woodworking', 'Handcrafted wooden furniture and decorative items', 'https://example.com/icons/woodworking.svg'),
('Metalwork', 'Handcrafted metal jewelry, sculptures, and tools', 'https://example.com/icons/metalwork.svg'),
('Glass Art', 'Handblown glass, stained glass, and glass sculptures', 'https://example.com/icons/glass.svg'),
('Leatherwork', 'Handcrafted leather goods and accessories', 'https://example.com/icons/leather.svg'),
('Jewelry', 'Handcrafted jewelry and accessories', 'https://example.com/icons/jewelry.svg'),
('Painting & Drawing', 'Original paintings, drawings, and illustrations', 'https://example.com/icons/painting.svg'),
('Sculpture', 'Three-dimensional artistic works', 'https://example.com/icons/sculpture.svg'),
('Other', 'Other forms of artisanal craftsmanship', 'https://example.com/icons/other.svg');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for artisan profiles with ratings
CREATE VIEW public.artisan_profiles AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.profile_image_url,
  u.bio,
  u.location,
  u.website_url,
  u.social_media,
  u.is_verified,
  a.business_name,
  a.art_form,
  a.years_practicing,
  a.rating,
  a.total_ratings,
  a.total_orders,
  a.is_featured,
  ac.name as category_name
FROM public.users u
JOIN public.artisans a ON u.id = a.id
LEFT JOIN public.artisan_categories ac ON a.category_id = ac.id
WHERE u.user_type = 'artisan' AND u.is_active = true;

-- View for product listings with artisan info
CREATE VIEW public.product_listings AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.currency,
  p.images,
  p.tags,
  p.is_customizable,
  p.stock_quantity,
  p.views_count,
  p.likes_count,
  p.created_at,
  u.name as artisan_name,
  u.profile_image_url as artisan_image,
  u.location as artisan_location,
  a.rating as artisan_rating,
  a.total_ratings as artisan_total_ratings
FROM public.products p
JOIN public.artisans a ON p.artisan_id = a.id
JOIN public.users u ON a.id = u.id
WHERE p.is_active = true;

-- View for content performance analytics
CREATE VIEW public.content_performance AS
SELECT 
  gc.id,
  gc.content_type,
  gc.platform,
  gc.title,
  gc.created_at,
  p.name as product_name,
  u.name as artisan_name,
  COALESCE(SUM(ca.metric_value) FILTER (WHERE ca.metric_type = 'view'), 0) as total_views,
  COALESCE(SUM(ca.metric_value) FILTER (WHERE ca.metric_type = 'like'), 0) as total_likes,
  COALESCE(SUM(ca.metric_value) FILTER (WHERE ca.metric_type = 'share'), 0) as total_shares,
  COALESCE(SUM(ca.metric_value) FILTER (WHERE ca.metric_type = 'comment'), 0) as total_comments
FROM public.generated_content gc
LEFT JOIN public.products p ON gc.product_id = p.id
LEFT JOIN public.users u ON gc.artisan_id = u.id
LEFT JOIN public.content_analytics ca ON gc.id = ca.content_id
GROUP BY gc.id, gc.content_type, gc.platform, gc.title, gc.created_at, p.name, u.name;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This schema is now complete and ready for use!
-- It includes everything needed for a comprehensive artisan marketplace
-- with AI-powered content generation, analytics, and e-commerce functionality.
