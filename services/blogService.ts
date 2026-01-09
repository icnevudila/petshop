
import { supabase } from '../supabaseClient';
import { BlogPost } from '../types';

/**
 * Get all blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }

    // Map DB fields to Type if needed (slug generated automatically or matched)
    return (data || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        img: post.image_url,
        category: post.category,
        author: post.author,
        created_at: post.created_at,
        is_published: post.is_published,
        slug: post.slug
    }));
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching blog post:', error);
        throw error;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        img: data.image_url,
        category: data.category,
        author: data.author,
        created_at: data.created_at,
        is_published: data.is_published,
        slug: data.slug // Ensure slug is returned
    } as any; // Temporary cast if type mismatch on slug
}

/**
 * Add a blog post
 */
export async function addBlogPost(post: Partial<BlogPost>): Promise<void> {
    // Generate slug from title if not provided
    const slug = post.title
        ? post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        : `post-${Date.now()}`;

    const { error } = await supabase
        .from('blog_posts')
        .insert({
            title: post.title,
            slug: slug,
            content: post.content,
            image_url: post.img,
            category: post.category,
            author: post.author,
            is_published: true
        });

    if (error) {
        console.error('Error adding blog post:', error);
        throw error;
    }
}

/**
 * Update a blog post
 */
export async function updateBlogPost(post: BlogPost): Promise<void> {
    const { error } = await supabase
        .from('blog_posts')
        .update({
            title: post.title,
            content: post.content,
            image_url: post.img,
            category: post.category,
            author: post.author,
            is_published: post.is_published
        })
        .eq('id', post.id);

    if (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}
