# Environment Setup Instructions

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key
HEYGEN_API_KEY=your_heygen_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Important Changes

### Video Generation Update

- **Removed**: `VEO3_API_KEY` (no longer needed)
- **Updated**: Now using Gemini's Veo 3 integration for video generation
- **Single API Key**: Only `GEMINI_API_KEY` is needed for both text and video generation

### How to Get Your API Keys

#### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the key and paste it as `GEMINI_API_KEY` in your `.env.local` file

#### HeyGen API Key

1. Go to [HeyGen AI](https://heygen.com/)
2. Sign up for an account
3. Go to your dashboard and find the API section
4. Generate a new API key
5. Copy the key and paste it as `HEYGEN_API_KEY` in your `.env.local` file

### Supabase Setup

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon key
5. Paste them as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. For the service role key, copy the `service_role` key from the same page

## Running the Application

1. Install dependencies: `npm install`
2. Create your `.env.local` file with the variables above
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Text Generation**: Uses Gemini API for creating captions, hashtags, and video scripts
- **Image Analysis**: Uses Gemini API to analyze product images and create detailed video prompts
- **Video Generation**: Uses HeyGen AI for creating professional product showcase videos
- **Database**: Comprehensive Supabase database for storing all artisan and customer data
- **Authentication**: Secure user authentication with Supabase Auth
