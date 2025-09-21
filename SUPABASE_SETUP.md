# Supabase Setup Guide for Artgram

This guide will help you set up Supabase as the backend database for your Artgram application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `artgram` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root (same level as `package.json`)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:

- `users` table for basic user information
- `artisans` table for artisan-specific data
- `customers` table for customer-specific data
- Row Level Security (RLS) policies
- Triggers for automatic profile creation
- Functions for handling user signup

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure the following:

### Site URL

- Set to `http://localhost:3000` for development
- Set to your production domain for production

### Redirect URLs

Add these URLs to the allowed redirect URLs:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/reset-password`
- Your production domain equivalents

### Email Templates (Optional)

You can customize the email templates for:

- Email confirmation
- Password reset
- Magic link

## 6. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`
3. Try creating a new account
4. Check your Supabase dashboard to see if the user was created in the `users` table

## 7. Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Update the Site URL in Supabase to your production domain
3. Add your production domain to the redirect URLs
4. Consider setting up email providers (SendGrid, Mailgun, etc.) for better email delivery

## Database Schema Overview

### Users Table

- `id`: UUID (references auth.users)
- `name`: User's display name
- `email`: User's email address
- `user_type`: Either 'customer' or 'artisan'
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Artisans Table

- `id`: UUID (references users.id)
- `art_form`: Primary art form (pottery, weaving, etc.)
- `years_practicing`: Years of experience
- `training_background`: How they learned their craft
- `bio`: Short biography
- `location`: Geographic location
- `contact_*`: Contact preferences
- `portfolio_files`: JSON array of portfolio items
- `intro_video`: URL to introduction video

### Customers Table

- `id`: UUID (references users.id)
- `preferences`: JSON object for user preferences

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Profile Creation**: User profiles are created automatically on signup
- **Secure Authentication**: Uses Supabase's built-in auth system
- **Type Safety**: Full TypeScript support

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check that your environment variables are set correctly
2. **"User not found"**: Make sure the database schema has been applied
3. **"Email not confirmed"**: Check your email settings in Supabase
4. **CORS errors**: Ensure your domain is added to the allowed origins

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Check the [Next.js Supabase Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
