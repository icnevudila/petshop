import { supabase } from '../supabaseClient';
import { Product } from '../types';

export interface WishlistItem {
    id: string;
    product_id: string;
    product?: Product;
}

/**
 * Get wishlist for current user
 */
export async function getWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
        .from('wishlist')
        .select(`
      id,
      product_id,
      products (
        id, name, slug, description, price, discounted_price, 
        stock, brand_id, category_id, images, tags, features,
        is_active, rating, review_count,
        brands (name, logo_url)
      )
    `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product: item.products ? {
            id: item.products.id,
            name: item.products.name,
            slug: item.products.slug,
            description: item.products.description,
            price: parseFloat(item.products.price),
            discounted_price: item.products.discounted_price ? parseFloat(item.products.discounted_price) : null,
            stock: item.products.stock,
            brand_id: item.products.brand_id,
            brand_name: item.products.brands?.name,
            brand_logo_url: item.products.brands?.logo_url,
            category_id: item.products.category_id,
            images: item.products.images || [],
            tags: item.products.tags || [],
            is_active: item.products.is_active,
            rating: parseFloat(item.products.rating) || 0,
            review_count: item.products.review_count || 0,
            features: item.products.features || []
        } : undefined
    }));
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: userId, product_id: productId });

    if (error) {
        // Ignore duplicate error
        if (error.code === '23505') return;
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}

/**
 * Toggle wishlist item
 */
export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
    // Check if exists
    const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

    if (existing) {
        await removeFromWishlist(userId, productId);
        return false; // Removed
    } else {
        await addToWishlist(userId, productId);
        return true; // Added
    }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
    const { data } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

    return !!data;
}

/**
 * Get wishlist product IDs (for quick checking)
 */
export async function getWishlistProductIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching wishlist IDs:', error);
        throw error;
    }

    return (data || []).map(item => item.product_id);
}
