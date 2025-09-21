# Database Schema Replacement Instructions

## 🗑️ **Step 1: Remove Old Schema in Supabase**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run this command to drop all existing tables:**

```sql
-- Drop all existing tables and related objects
DROP TABLE IF EXISTS public.content_analytics CASCADE;
DROP TABLE IF EXISTS public.scheduled_posts CASCADE;
DROP TABLE IF EXISTS public.generated_content CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.artisan_categories CASCADE;
DROP TABLE IF EXISTS public.customer_preferences CASCADE;
DROP TABLE IF EXISTS public.artisans CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP SEQUENCE IF EXISTS order_sequence CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.artisan_profiles CASCADE;
DROP VIEW IF EXISTS public.product_listings CASCADE;
DROP VIEW IF EXISTS public.content_performance CASCADE;
```

## 🆕 **Step 2: Apply New Comprehensive Schema**

1. **Copy the entire contents of `comprehensive-schema.sql`**
2. **Paste it into the Supabase SQL Editor**
3. **Click "Run" to execute the new schema**

## ✅ **Step 3: Verify Installation**

Run this query to verify all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:

- artisan_categories
- artisans
- content_analytics
- customer_preferences
- customers
- generated_content
- messages
- notifications
- order_items
- orders
- products
- reviews
- scheduled_posts
- users

## 🎯 **What This New Schema Includes:**

### **User Management:**

- Complete user profiles with social media, verification, activity tracking
- Separate artisan and customer profiles with role-specific data
- Customer preferences and interests tracking

### **Product Management:**

- Comprehensive product catalog with dimensions, materials, customization
- Digital and physical products support
- Stock management and pricing
- Product analytics (views, likes, shares)

### **AI Content Generation:**

- Generated content storage (captions, hashtags, videos, scripts)
- Platform-specific content optimization
- AI model tracking and generation settings
- Content performance analytics

### **E-commerce:**

- Complete order management system
- Order items with customization data
- Payment tracking and status management
- Shipping and delivery management

### **Analytics & Performance:**

- Detailed content performance tracking
- User engagement metrics
- Platform-specific analytics
- Demographic and device tracking

### **Communication:**

- Messaging system between users
- Notification system
- Review and rating system

### **Scheduling:**

- Social media post scheduling
- Multi-platform content distribution
- Post status tracking

### **Sample Data:**

- Pre-populated artisan categories
- Ready-to-use views for common queries
- Performance-optimized indexes

## 🚀 **Ready to Use!**

After applying this schema, your Artisan Reels app will have a complete database foundation that captures everything from both artisans and customers, including all the AI-generated content, analytics, and e-commerce functionality!
