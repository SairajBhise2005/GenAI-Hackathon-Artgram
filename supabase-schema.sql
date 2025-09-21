-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'artisan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create artisans table (extends users for artisan-specific data)
CREATE TABLE IF NOT EXISTS public.artisans (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  art_form TEXT,
  years_practicing INTEGER DEFAULT 0,
  training_background TEXT,
  bio TEXT,
  location TEXT,
  contact_whatsapp BOOLEAN DEFAULT FALSE,
  contact_phone BOOLEAN DEFAULT FALSE,
  contact_email BOOLEAN DEFAULT TRUE,
  portfolio_files JSONB DEFAULT '[]',
  intro_video TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on artisans table
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;

-- Create policies for artisans table
CREATE POLICY "Artisans can view their own profile" ON public.artisans
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Artisans can update their own profile" ON public.artisans
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Artisans can insert their own profile" ON public.artisans
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create customers table (extends users for customer-specific data)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Customers can view their own profile" ON public.customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update their own profile" ON public.customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can insert their own profile" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create user profile
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

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
