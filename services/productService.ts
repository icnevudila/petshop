import { supabase } from '../supabaseClient';
import { Product } from '../types';

export interface ProductFilters {
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    searchQuery?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
    page?: number;
    limit?: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Fetch all products with optional filtering, sorting, and pagination
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const {
        categoryId,
        brandId,
        minPrice,
        maxPrice,
        tags,
        searchQuery,
        sortBy = 'newest',
        page = 1,
        limit = 20
    } = filters;

    let query = supabase
        .from('products')
        .select('*, brands(name, logo_url)', { count: 'exact' })
        .eq('is_active', true);

    // Apply filters
    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    if (brandId) {
        query = query.eq('brand_id', brandId);
    }

    if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
    }

    if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags);
    }

    if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    switch (sortBy) {
        case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
        case 'rating':
            query = query.order('rating', { ascending: false });
            break;
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    // Transform data to match Product type
    const products: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: parseFloat(item.price),
        discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
        stock: item.stock,
        brand_id: item.brand_id,
        brand_name: item.brands?.name,
        brand_logo_url: item.brands?.logo_url,
        category_id: item.category_id,
        images: item.images || [],
        tags: item.tags || [],
        is_active: item.is_active,
        rating: parseFloat(item.rating) || 0,
        review_count: item.review_count || 0,
        features: item.features || []
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return { products, total, page, totalPages };
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*, brands(name, logo_url)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching product:', error);
        throw error;
    }

    if (!data) return null;

    return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        discounted_price: data.discounted_price ? parseFloat(data.discounted_price) : null,
        stock: data.stock,
        brand_id: data.brand_id,
        brand_name: data.brands?.name,
        brand_logo_url: data.brands?.logo_url,
        category_id: data.category_id,
        images: data.images || [],
        tags: data.tags || [],
        is_active: data.is_active,
        rating: parseFloat(data.rating) || 0,
        review_count: data.review_count || 0,
        features: data.features || []
    };
}

/**
 * Get products by category (including subcategories)
 */
export async function getProductsByCategory(categorySlug: string, filters: Omit<ProductFilters, 'categoryId'> = {}): Promise<ProductsResponse> {
    // First get the category ID from slug
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

    if (!category) {
        return { products: [], total: 0, page: 1, totalPages: 0 };
    }

    // Get all subcategory IDs
    const { data: subcategories } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', category.id);

    const categoryIds = [category.id, ...(subcategories?.map(c => c.id) || [])];

    // Fetch products from all relevant categories
    let query = supabase
        .from('products')
        .select('*, brands(name, logo_url)', { count: 'exact' })
        .eq('is_active', true)
        .in('category_id', categoryIds);

    // Apply additional filters
    if (filters.brandId) query = query.eq('brand_id', filters.brandId);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%`);
    }

    // Sorting
    const sortBy = filters.sortBy || 'newest';
    switch (sortBy) {
        case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
        case 'rating':
            query = query.order('rating', { ascending: false });
            break;
        default:
            query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }

    const products: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: parseFloat(item.price),
        discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
        stock: item.stock,
        brand_id: item.brand_id,
        brand_name: item.brands?.name,
        brand_logo_url: item.brands?.logo_url,
        category_id: item.category_id,
        images: item.images || [],
        tags: item.tags || [],
        is_active: item.is_active,
        rating: parseFloat(item.rating) || 0,
        review_count: item.review_count || 0,
        features: item.features || []
    }));

    return {
        products,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, brands(name, logo_url)')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .limit(limit);

    if (error) {
        console.error('Error searching products:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: parseFloat(item.price),
        discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
        stock: item.stock,
        brand_id: item.brand_id,
        brand_name: item.brands?.name,
        brand_logo_url: item.brands?.logo_url,
        category_id: item.category_id,
        images: item.images || [],
        tags: item.tags || [],
        is_active: item.is_active,
        rating: parseFloat(item.rating) || 0,
        review_count: item.review_count || 0,
        features: item.features || []
    }));
}

/**
 * Get featured/popular products
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, brands(name, logo_url)')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: parseFloat(item.price),
        discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
        stock: item.stock,
        brand_id: item.brand_id,
        brand_name: item.brands?.name,
        brand_logo_url: item.brands?.logo_url,
        category_id: item.category_id,
        images: item.images || [],
        tags: item.tags || [],
        is_active: item.is_active,
        rating: parseFloat(item.rating) || 0,
        review_count: item.review_count || 0,
        features: item.features || []
    }));
}

/**
 * Get discounted products
 */
export async function getDiscountedProducts(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, brands(name, logo_url)')
        .eq('is_active', true)
        .not('discounted_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching discounted products:', error);
        throw error;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: parseFloat(item.price),
        discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
        stock: item.stock,
        brand_id: item.brand_id,
        brand_name: item.brands?.name,
        brand_logo_url: item.brands?.logo_url,
        category_id: item.category_id,
        images: item.images || [],
        tags: item.tags || [],
        is_active: item.is_active,
        rating: parseFloat(item.rating) || 0,
        review_count: item.review_count || 0,
        features: item.features || []
    }));
}
