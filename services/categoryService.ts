import { supabase } from '../supabaseClient';
import { Category, Brand } from '../types';

/**
 * Get all categories with hierarchical structure
 */
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get parent categories only
 */
export async function getParentCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');

    if (error) {
        console.error('Error fetching parent categories:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get subcategories of a parent category
 */
export async function getSubcategories(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('name');

    if (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching category:', error);
        throw error;
    }

    return data;
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching brand:', error);
        throw error;
    }

    return data;
}

/**
 * Get brands that have products in a specific category
 */
export async function getBrandsByCategory(categoryId: string): Promise<Brand[]> {
    const { data, error } = await supabase
        .from('products')
        .select('brand_id, brands(*)')
        .eq('category_id', categoryId)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching brands by category:', error);
        throw error;
    }

    // Get unique brands
    const brandsMap = new Map<string, Brand>();
    (data || []).forEach((item: any) => {
        if (item.brands && !brandsMap.has(item.brand_id)) {
            brandsMap.set(item.brand_id, item.brands);
        }
    });

    return Array.from(brandsMap.values());
}
