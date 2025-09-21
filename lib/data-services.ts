"use server";

import { createClient } from "@/lib/supabase-server";

// =====================================================
// PRODUCT SERVICES
// =====================================================

export async function createProduct(productData: {
  artisan_id: string;
  name: string;
  description: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency?: string;
  dimensions?: Record<string, any>;
  weight?: number;
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  images?: any[];
  videos?: any[];
  tags?: string[];
  is_customizable?: boolean;
  customization_options?: Record<string, any>;
  stock_quantity?: number;
  is_digital?: boolean;
  digital_delivery_method?: string;
  shipping_info?: Record<string, any>;
}) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function getProducts(filters?: {
  artisan_id?: string;
  category?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}) {
  try {
    const supabase = createClient();

    let query = supabase.from("products").select(`
        *,
        artisans!inner(
          id,
          business_name,
          art_form,
          rating,
          total_ratings,
          users!inner(
            id,
            name,
            profile_image_url,
            location
          )
        )
      `);

    if (filters?.artisan_id) {
      query = query.eq("artisan_id", filters.artisan_id);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function updateProduct(
  productId: string,
  updates: Record<string, any>
) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// =====================================================
// CONTENT GENERATION SERVICES
// =====================================================

export async function saveGeneratedContent(contentData: {
  product_id: string;
  artisan_id: string;
  content_type: "caption" | "hashtags" | "video_script" | "video" | "image";
  platform:
    | "instagram"
    | "facebook"
    | "tiktok"
    | "linkedin"
    | "twitter"
    | "youtube";
  title?: string;
  content: string;
  metadata?: Record<string, any>;
  ai_model_used?: string;
  generation_prompt?: string;
  generation_settings?: Record<string, any>;
  file_url?: string;
  file_size?: number;
  duration?: number;
  dimensions?: Record<string, any>;
}) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("generated_content")
      .insert([contentData])
      .select()
      .single();

    if (error) {
      console.error("Error saving generated content:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error saving generated content:", error);
    return { success: false, error: "Failed to save generated content" };
  }
}

export async function getGeneratedContent(filters?: {
  product_id?: string;
  artisan_id?: string;
  content_type?: string;
  platform?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const supabase = createClient();

    let query = supabase.from("generated_content").select(`
        *,
        products!inner(
          id,
          name,
          images
        )
      `);

    if (filters?.product_id) {
      query = query.eq("product_id", filters.product_id);
    }
    if (filters?.artisan_id) {
      query = query.eq("artisan_id", filters.artisan_id);
    }
    if (filters?.content_type) {
      query = query.eq("content_type", filters.content_type);
    }
    if (filters?.platform) {
      query = query.eq("platform", filters.platform);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching generated content:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching generated content:", error);
    return { success: false, error: "Failed to fetch generated content" };
  }
}

// =====================================================
// SCHEDULED POSTS SERVICES
// =====================================================

export async function schedulePost(postData: {
  artisan_id: string;
  product_id: string;
  content_id: string;
  platform:
    | "instagram"
    | "facebook"
    | "tiktok"
    | "linkedin"
    | "twitter"
    | "youtube";
  post_type: "image" | "video" | "carousel" | "story" | "reel";
  content_data: Record<string, any>;
  scheduled_for: string;
  timezone?: string;
}) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error("Error scheduling post:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error scheduling post:", error);
    return { success: false, error: "Failed to schedule post" };
  }
}

export async function getScheduledPosts(filters?: {
  artisan_id?: string;
  status?: string;
  platform?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const supabase = createClient();

    let query = supabase.from("scheduled_posts").select(`
        *,
        products!inner(
          id,
          name,
          images
        ),
        generated_content!inner(
          id,
          content_type,
          content
        )
      `);

    if (filters?.artisan_id) {
      query = query.eq("artisan_id", filters.artisan_id);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.platform) {
      query = query.eq("platform", filters.platform);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query.order("scheduled_for", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching scheduled posts:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return { success: false, error: "Failed to fetch scheduled posts" };
  }
}

// =====================================================
// ANALYTICS SERVICES
// =====================================================

export async function recordContentAnalytics(analyticsData: {
  content_id: string;
  artisan_id: string;
  platform: string;
  metric_type:
    | "view"
    | "like"
    | "share"
    | "comment"
    | "save"
    | "click"
    | "impression";
  metric_value?: number;
  demographics?: Record<string, any>;
  device_info?: Record<string, any>;
  source?: Record<string, any>;
}) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("content_analytics")
      .insert([analyticsData])
      .select()
      .single();

    if (error) {
      console.error("Error recording analytics:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error recording analytics:", error);
    return { success: false, error: "Failed to record analytics" };
  }
}

export async function getContentAnalytics(filters?: {
  content_id?: string;
  artisan_id?: string;
  platform?: string;
  metric_type?: string;
  date_from?: string;
  date_to?: string;
}) {
  try {
    const supabase = createClient();

    let query = supabase.from("content_analytics").select("*");

    if (filters?.content_id) {
      query = query.eq("content_id", filters.content_id);
    }
    if (filters?.artisan_id) {
      query = query.eq("artisan_id", filters.artisan_id);
    }
    if (filters?.platform) {
      query = query.eq("platform", filters.platform);
    }
    if (filters?.metric_type) {
      query = query.eq("metric_type", filters.metric_type);
    }
    if (filters?.date_from) {
      query = query.gte("date_recorded", filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte("date_recorded", filters.date_to);
    }

    const { data, error } = await query.order("date_recorded", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching analytics:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

// =====================================================
// ARTISAN SERVICES
// =====================================================

export async function updateArtisanProfile(
  artisanId: string,
  updates: Record<string, any>
) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("artisans")
      .update(updates)
      .eq("id", artisanId)
      .select()
      .single();

    if (error) {
      console.error("Error updating artisan profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating artisan profile:", error);
    return { success: false, error: "Failed to update artisan profile" };
  }
}

export async function getArtisanProfile(artisanId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("artisans")
      .select(
        `
        *,
        users!inner(
          id,
          name,
          email,
          profile_image_url,
          bio,
          location,
          website_url,
          social_media,
          is_verified,
          created_at
        )
      `
      )
      .eq("id", artisanId)
      .single();

    if (error) {
      console.error("Error fetching artisan profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching artisan profile:", error);
    return { success: false, error: "Failed to fetch artisan profile" };
  }
}

// =====================================================
// CUSTOMER SERVICES
// =====================================================

export async function updateCustomerProfile(
  customerId: string,
  updates: Record<string, any>
) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", customerId)
      .select()
      .single();

    if (error) {
      console.error("Error updating customer profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return { success: false, error: "Failed to update customer profile" };
  }
}

export async function getCustomerProfile(customerId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("customers")
      .select(
        `
        *,
        users!inner(
          id,
          name,
          email,
          profile_image_url,
          bio,
          location,
          created_at
        )
      `
      )
      .eq("id", customerId)
      .single();

    if (error) {
      console.error("Error fetching customer profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return { success: false, error: "Failed to fetch customer profile" };
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export async function getArtisanCategories() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("artisan_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching artisan categories:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching artisan categories:", error);
    return { success: false, error: "Failed to fetch artisan categories" };
  }
}

export async function searchProducts(
  searchTerm: string,
  filters?: {
    category?: string;
    artisan_id?: string;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
  }
) {
  try {
    const supabase = createClient();

    let query = supabase
      .from("products")
      .select(
        `
        *,
        artisans!inner(
          id,
          business_name,
          art_form,
          rating,
          total_ratings,
          users!inner(
            id,
            name,
            profile_image_url,
            location
          )
        )
      `
      )
      .textSearch("name", searchTerm)
      .eq("is_active", true);

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.artisan_id) {
      query = query.eq("artisan_id", filters.artisan_id);
    }
    if (filters?.min_price) {
      query = query.gte("price", filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte("price", filters.max_price);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching products:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products" };
  }
}
