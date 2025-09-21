# ArtisanAI - AI-Powered Social Media for Artisans

## 🎯 Problem Statement

Small artisans struggle to market their products effectively on social media due to:

- Lack of time to create engaging content
- Limited knowledge of social media marketing
- Difficulty in creating professional-looking posts and videos
- Inconsistent posting schedules
- Language barriers for content creation

## 💡 Solution

ArtisanAI is a comprehensive platform that helps small artisans increase their reach through AI-powered social media content creation. Our platform:

1. **Converts speech to text** - Artisans can describe their products naturally in their native language
2. **Generates engaging content** - AI creates captions, hashtags, and video scripts optimized for different platforms
3. **Creates product videos** - Automatically generates eye-catching videos from product photos
4. **Schedules posts** - Manages content across Instagram, Facebook, TikTok, and LinkedIn
5. **Tracks performance** - Provides analytics to help artisans grow their reach

## 🚀 Key Features

### AI Content Generation

- **Speech-to-Text**: Describe products naturally using voice input
- **Smart Captions**: Generate platform-optimized captions for Instagram, Facebook, TikTok, and LinkedIn
- **Hashtag Generation**: Create relevant hashtags to increase discoverability
- **Video Scripts**: Generate engaging video scripts for product showcases

### Video Creation

- **Automatic Video Generation**: Create product videos from photos using Vertex AI
- **Multi-format Support**: Generate videos optimized for different social media platforms
- **Professional Quality**: AI-enhanced video creation with smooth transitions and effects

### Social Media Management

- **Multi-platform Scheduling**: Schedule posts across Instagram, Facebook, TikTok, and LinkedIn
- **Content Calendar**: Visual calendar for managing posting schedules
- **Platform Optimization**: Content automatically optimized for each platform's requirements

### Analytics & Insights

- **Performance Tracking**: Monitor views, likes, comments, and shares
- **Growth Analytics**: Track follower growth and engagement trends
- **Content Insights**: Identify best-performing content types and posting times

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Backend & Database

- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

### AI Services

- **Google Gemini API** - Text generation for captions and scripts
- **Google Vertex AI** - Video generation from images
- **Web Speech API** - Speech-to-text conversion

### Authentication

- **Supabase Auth** - Secure user authentication
- **Server-side rendering** - Optimized performance
- **Session management** - Persistent user sessions

## 📱 User Journey

### For Artisans:

1. **Sign Up** - Create account as artisan or customer
2. **Describe Product** - Use speech-to-text or type product description
3. **Upload Media** - Add product photos and videos
4. **Generate Content** - AI creates captions, hashtags, and video scripts
5. **Create Video** - Generate professional product videos
6. **Schedule Posts** - Plan content across multiple platforms
7. **Track Performance** - Monitor engagement and growth

### For Customers:

1. **Browse Products** - Discover unique artisan products
2. **View Content** - See AI-generated product showcases
3. **Connect with Artisans** - Direct communication with creators
4. **Support Local** - Purchase from local artisans

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Modern dark theme
- **Accessibility** - WCAG compliant design
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Feedback** - Loading states and progress indicators
- **Copy-to-Clipboard** - Easy content sharing

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud account (for AI APIs)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd artisan-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Add your credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase**

   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Configure authentication settings

5. **Set up AI APIs**

   - Get Gemini API key from Google AI Studio
   - Set up Vertex AI project in Google Cloud
   - Add API keys to environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Netlify**: Connect repository and add environment variables
- **Railway**: Deploy with automatic environment detection
- **DigitalOcean**: Use App Platform for easy deployment

## 📊 Future Enhancements

### Phase 2 Features

- **Multi-language Support** - Support for regional languages
- **Advanced Analytics** - Detailed performance insights
- **AI Image Enhancement** - Improve product photos automatically
- **Social Media Integration** - Direct posting to platforms
- **E-commerce Integration** - Direct product sales
- **Community Features** - Artisan networking and collaboration

### Phase 3 Features

- **Mobile App** - Native iOS and Android apps
- **AI Chatbot** - Customer support and product recommendations
- **Marketplace** - Integrated e-commerce platform
- **Advanced Video Editing** - Professional video creation tools
- **Influencer Network** - Connect with social media influencers

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Impact

This project addresses a real problem faced by millions of artisans worldwide:

- **Democratizes Marketing** - Makes professional marketing accessible to all artisans
- **Preserves Culture** - Helps traditional crafts reach global audiences
- **Economic Impact** - Increases artisan income through better marketing
- **Technology Access** - Bridges the digital divide for traditional craftspeople

## 👥 Team

- **Frontend Development** - React/Next.js expertise
- **Backend Development** - Supabase and API integration
- **AI Integration** - Gemini and Vertex AI implementation
- **UI/UX Design** - User-centered design approach
- **Product Strategy** - Market research and user validation

## 📞 Contact

For questions or support, please contact us at [email@artisanai.com]

---

**Built with ❤️ for the artisan community**
