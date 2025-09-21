# HeyGen AI Video Generation Setup Guide

## Overview

The Artisan Reels app now uses HeyGen AI for video generation, combined with Gemini AI for intelligent image analysis and prompt creation. This creates a powerful two-step process:

1. **Gemini analyzes product images** and creates detailed, eye-catching video prompts
2. **HeyGen generates professional videos** based on the analyzed images and detailed prompts

## Prerequisites

### 1. HeyGen AI Account

1. Go to [HeyGen AI](https://heygen.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Go to the API section to generate your API key

### 2. Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key

## Environment Variables

Add these to your `.env.local` file:

```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key
HEYGEN_API_KEY=your_heygen_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## How It Works

### Step 1: Image Analysis with Gemini

When you upload product images, Gemini AI analyzes them and creates a detailed video prompt that includes:

- **Visual style and mood** (cinematic, vibrant, elegant, rustic)
- **Camera movements** (slow zoom in, panning shot, close-up details)
- **Lighting description** (warm golden hour lighting, soft studio lighting)
- **Color palette and atmosphere**
- **Specific visual elements to highlight**
- **Pacing and rhythm** (slow and contemplative, dynamic and energetic)
- **Target audience appeal** (appealing to young professionals, attracting luxury buyers)

### Step 2: Video Generation with HeyGen

HeyGen AI uses the detailed prompt and your script to create a professional product showcase video with:

- **9:16 aspect ratio** (perfect for Instagram and TikTok)
- **High quality** video output
- **Background removal** from product images
- **Professional avatars** presenting your product
- **Voice synthesis** from your script
- **Custom backgrounds** based on your product images

## API Features

### Gemini Integration

- **Multi-modal analysis**: Analyzes both text and images
- **Intelligent prompting**: Creates detailed, optimized prompts for HeyGen
- **Context awareness**: Considers product type, target audience, and platform

### HeyGen Integration

- **Avatar-based videos**: Professional presenters showcase your products
- **Voice synthesis**: Converts your script to natural speech
- **Background customization**: Uses your product images as backgrounds
- **Social media optimized**: Perfect aspect ratios and quality for platforms

## Video Generation Process

1. **Upload Product Images**: User uploads 1-5 product images
2. **Enter Product Details**: Name, description, script, and artisan info
3. **Gemini Analysis**: AI analyzes images and creates detailed video prompt
4. **HeyGen Generation**: Creates professional video with avatar presenter
5. **Video Delivery**: Returns high-quality video URL for download/sharing

## Testing

1. Set up your environment variables
2. Run the application: `npm run dev`
3. Go to `/test-video` to test video generation
4. Upload product images and enter details
5. Click "Test Video Generation"
6. Check browser console for detailed logs

## Important Notes

### HeyGen API Limits

- **Free tier**: Limited number of video generations per month
- **Paid tiers**: Higher limits and additional features
- **Video length**: Typically 30-60 seconds for product showcases
- **Processing time**: 2-5 minutes for video generation

### Gemini API Limits

- **Free tier**: 15 requests per minute
- **Paid tier**: Higher limits available
- **Image analysis**: Supports multiple images per request
- **Response time**: Usually under 10 seconds

### Best Practices

1. **High-quality images**: Upload clear, well-lit product photos
2. **Detailed scripts**: Write engaging, descriptive scripts
3. **Product context**: Include relevant product information
4. **Target audience**: Consider who will watch the videos

## Troubleshooting

### Common Issues

1. **API Key Errors**:

   - Verify both `GEMINI_API_KEY` and `HEYGEN_API_KEY` are set
   - Check that keys are valid and not expired

2. **Image Upload Issues**:

   - Ensure images are in supported formats (JPEG, PNG)
   - Check file sizes (recommended under 10MB per image)

3. **Video Generation Failures**:

   - Check HeyGen API status
   - Verify account limits haven't been exceeded
   - Review error messages in browser console

4. **Slow Performance**:
   - Video generation typically takes 2-5 minutes
   - Check your internet connection
   - Monitor API response times

### Debug Steps

1. Check browser console for detailed logs
2. Verify API keys are correctly set
3. Test with simple product descriptions first
4. Check HeyGen dashboard for usage limits
5. Review Gemini API quota usage

## Support

- **HeyGen Documentation**: [https://docs.heygen.com/](https://docs.heygen.com/)
- **Gemini API Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **HeyGen Support**: Contact through their dashboard
- **Google AI Support**: [https://ai.google.dev/support](https://ai.google.dev/support)

## Cost Considerations

### HeyGen Pricing

- **Free tier**: Limited video generations
- **Starter plan**: $29/month for more generations
- **Professional plan**: $89/month for high-volume usage

### Gemini Pricing

- **Free tier**: 15 requests per minute
- **Paid tier**: Pay-per-use pricing
- **Image analysis**: Additional cost per image

### Optimization Tips

1. **Batch processing**: Generate multiple videos in one session
2. **Image optimization**: Compress images before upload
3. **Script efficiency**: Write concise, effective scripts
4. **Monitor usage**: Track API usage to avoid overages

