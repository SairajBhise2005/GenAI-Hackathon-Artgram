# API Keys Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Environment File

Create a `.env.local` file in your project root (same level as `package.json`) with the following content:

```env
# Supabase Configuration (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://lruzvngxewdusdegavls.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydXp2bmd4ZXdkdXNkZWdhdmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTI4MDEsImV4cCI6MjA3MzgyODgwMX0.wMLKdJj2fiUoO4toQa0Dbo_H7GH3carBK_69rANkLtA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydXp2bmd4ZXdkdXNkZWdhdmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI1MjgwMSwiZXhwIjoyMDczODI4ODAxfQ.OTeCtJdY9X3icMbxEg4MGxZ6dmhcx1HSZo_h5Q5A0fU

# AI API Keys (REPLACE THESE WITH YOUR ACTUAL KEYS)
GEMINI_API_KEY=your_gemini_api_key_here
VERTEX_AI_PROJECT_ID=your_vertex_ai_project_id_here
VERTEX_AI_LOCATION=us-central1

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔑 Getting Your API Keys

### **Gemini API Key (Required for Text Generation)**

1. **Go to Google AI Studio**

   - Visit: https://aistudio.google.com/
   - Sign in with your Google account

2. **Create API Key**

   - Click "Get API Key" button
   - Click "Create API Key"
   - Select "Create API key in new project" or choose existing project
   - Copy the generated API key

3. **Replace in .env.local**
   ```env
   GEMINI_API_KEY=AIzaSyC...your_actual_key_here
   ```

### **Vertex AI Project ID (Optional for Video Generation)**

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**

   - Click the project dropdown at the top
   - Click "New Project" or select existing project
   - Note your Project ID (not the project name)

3. **Enable Vertex AI API**

   - Go to "APIs & Services" → "Library"
   - Search for "Vertex AI API"
   - Click "Enable"

4. **Replace in .env.local**
   ```env
   VERTEX_AI_PROJECT_ID=your-project-id-123456
   ```

## 🧪 Testing Your Setup

### 1. **Start Development Server**

```bash
npm run dev
```

### 2. **Test AI Content Generation**

1. Go to `http://localhost:3000/create`
2. Fill in product information
3. Click "Generate AI Content"
4. Check browser console for any errors

### 3. **Check Console Messages**

- ✅ **Success**: "Content generated with Gemini API"
- ⚠️ **Fallback**: "GEMINI_API_KEY not found, using mock response"
- ❌ **Error**: Check the error message and verify your API key

## 🔧 Troubleshooting

### **Common Issues:**

1. **"GEMINI_API_KEY not found"**

   - Make sure `.env.local` file exists in project root
   - Restart your development server after adding keys
   - Check for typos in the environment variable name

2. **"Gemini API error: 403"**

   - Verify your API key is correct
   - Check if you have enabled the Gemini API in Google AI Studio
   - Ensure you have sufficient quota

3. **"Gemini API error: 400"**
   - Check your prompt format
   - Verify the API endpoint URL

### **Environment Variables Not Loading:**

```bash
# Make sure you're in the project root
cd C:\Users\A\Desktop\Artgram

# Restart the development server
npm run dev
```

## 🎯 What Works Without API Keys

The app is designed to work perfectly for your hackathon demo even without API keys:

- ✅ **Mock AI Content Generation** - Generates realistic sample content
- ✅ **Speech-to-Text** - Uses browser's built-in speech recognition
- ✅ **Image Upload** - Full file handling functionality
- ✅ **Social Media Scheduler** - Complete scheduling interface
- ✅ **Dashboard** - Analytics and content management
- ✅ **Authentication** - Full Supabase auth system

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add Environment Variables** in your hosting platform's dashboard
2. **Never commit `.env.local`** to version control
3. **Use production URLs** for `NEXT_PUBLIC_SITE_URL`

## 📝 Next Steps

1. **Copy the `.env.local` template above**
2. **Get your Gemini API key** from Google AI Studio
3. **Replace the placeholder values** with your actual keys
4. **Restart your development server**
5. **Test the content generation** at `/create`

The app will automatically use real AI when keys are available, or fall back to mock responses for your demo!
