import { supabase } from '../supabaseClient';
import { Product, CartEntry } from '../types';

export interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    product?: Product;
}

/**
 * Get cart items for current user
 */
export async function getCart(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      product_id,
      quantity,
      products (
        id, name, slug, description, price, discounted_price, 
        stock, brand_id, category_id, images, tags, features,
        is_active, rating, review_count,
        brands (name, logo_url)
      )
    `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
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
 * Add item to cart
 */
export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    // Check if item already exists in cart
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

    if (existing) {
        // Update quantity
        await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id);
    } else {
        // Insert new item
        const { error } = await supabase
            .from('cart_items')
            .insert({ user_id: userId, product_id: productId, quantity });

        if (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
        await removeFromCart(userId, productId);
        return;
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

/**
 * Clear entire cart
 */
export async function clearCart(userId: string): Promise<void> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}

/**
 * Sync local cart to database (for when user logs in)
 */
export async function syncLocalCartToDb(userId: string, localCart: CartEntry[]): Promise<void> {
    for (const item of localCart) {
        await addToCart(userId, item.product_id, item.quantity);
    }
}

/**
 * Get cart count
 */
export async function getCartCount(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', userId);

    if (error) {
        console.error('Error getting cart count:', error);
        throw error;
    }

    return (data || []).reduce((sum, item) => sum + item.quantity, 0);
}
