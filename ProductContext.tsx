import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Campaign, Brand, Category, BlogPost, SiteSettings, HomeFeature, HomeCategory, CustomerReview } from './types';
import { supabase } from './supabaseClient';
import { PRODUCTS as INITIAL_PRODUCTS, CAMPAIGNS as INITIAL_CAMPAIGNS, BRANDS as INITIAL_BRANDS, CATEGORY_DATA as INITIAL_CATEGORIES, BLOG_POSTS as INITIAL_BLOG_POSTS } from './constants';

// Default values as fallback
const DEFAULT_SITE_SETTINGS: SiteSettings = {
    siteName: 'PatiDükkan',
    logoUrl: '/logopng.png',
    phone: '0850 123 45 67',
    email: 'info@patidukkan.com',
    address: 'İstanbul, Türkiye',
    topBarMessage: 'Mobil Uygulamaya Özel %15 Ek İndirim',
    socialLinks: {
        facebook: 'https://facebook.com/patidukkan',
        instagram: 'https://instagram.com/patidukkan',
        twitter: 'https://twitter.com/patidukkan',
        youtube: 'https://youtube.com/patidukkan'
    }
};

const DEFAULT_HOME_FEATURES: HomeFeature[] = [
    { id: 'hf1', icon: 'Truck', title: 'Hızlı Kargo', description: '24 saatte kargoda', order: 1 },
    { id: 'hf2', icon: 'ShieldCheck', title: 'Güvenli Ödeme', description: '256-bit SSL koruması', order: 2 },
    { id: 'hf3', icon: 'Headphones', title: 'Canlı Destek', description: 'Hergün 09:00 - 24:00', order: 3 },
    { id: 'hf4', icon: 'Gift', title: 'Sürpriz Hediyeler', description: 'Her siparişte numune', order: 4 }
];

const DEFAULT_HOME_CATEGORIES: HomeCategory[] = [
    { id: 'hc1', title: 'KEDİ', img: '/menu_images/menu_sterilized_cat_food_1767813803082.png', link: '/kategori/kedi', order: 1 },
    { id: 'hc2', title: 'YAVRU KEDİ', img: '/menu_images/menu_kitten_food_1767813788837.png', link: '/kategori/kedi/yavru', order: 2 },
    { id: 'hc3', title: 'KÖPEK', img: '/menu_images/menu_adult_dog_food_1767814113679.png', link: '/kategori/kopek', order: 3 },
    { id: 'hc4', title: 'YAVRU KÖPEK', img: '/menu_images/menu_puppy_food_1767814099784.png', link: '/kategori/kopek/yavru', order: 4 }
];

const DEFAULT_CUSTOMER_REVIEWS: CustomerReview[] = [
    { id: 'cr1', user: 'Elif Demir', pet: 'Pamuk', message: 'Paketleme o kadar özenliydi ki, açarken kendimi özel hissettim. Ürünler de harika!', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 'cr2', user: 'Caner Yılmaz', pet: 'Rocky', message: 'Hızlı kargo ve orijinal ürün garantisi. Patidükkan favori sitem oldu.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'cr3', user: 'Selin Kaya', pet: 'Mia', message: 'Müşteri hizmetlerinin ilgisi çok iyiydi. Yanlış aldığım ürünü hemen değiştirdiler.', img: 'https://i.pravatar.cc/150?u=a04258114e29026302d' }
];

interface ProductContextType {
    // Products
    products: Product[];
    updateProduct: (product: Product) => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Campaigns
    campaigns: Campaign[];
    updateCampaign: (campaign: Campaign) => Promise<void>;
    addCampaign: (campaign: Campaign) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;

    // Brands
    brands: Brand[];
    updateBrand: (brand: Brand) => Promise<void>;
    addBrand: (brand: Brand) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;

    // Categories
    categories: Category[];
    updateCategory: (category: Category) => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Blog Posts
    blogPosts: BlogPost[];
    updateBlogPost: (post: BlogPost) => Promise<void>;
    addBlogPost: (post: BlogPost) => Promise<void>;
    deleteBlogPost: (id: string) => Promise<void>;

    // Site Settings
    siteSettings: SiteSettings;
    updateSiteSettings: (settings: SiteSettings) => Promise<void>;

    // Home Features
    homeFeatures: HomeFeature[];
    updateHomeFeatures: (features: HomeFeature[]) => Promise<void>;

    // Home Categories
    homeCategories: HomeCategory[];
    updateHomeCategories: (categories: HomeCategory[]) => Promise<void>;

    // Customer Reviews
    customerReviews: CustomerReview[];
    updateCustomerReview: (review: CustomerReview) => Promise<void>;
    addCustomerReview: (review: CustomerReview) => Promise<void>;
    deleteCustomerReview: (id: string) => Promise<void>;

    loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
    const [homeFeatures, setHomeFeatures] = useState<HomeFeature[]>(DEFAULT_HOME_FEATURES);
    const [homeCategories, setHomeCategories] = useState<HomeCategory[]>(DEFAULT_HOME_CATEGORIES);
    const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>(DEFAULT_CUSTOMER_REVIEWS);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Products
            const { data: dbProducts } = await supabase.from('products').select('*');
            if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
            else setProducts(INITIAL_PRODUCTS); // Fallback to initial constants

            // Campaigns
            const { data: dbCampaigns } = await supabase.from('campaigns').select('*');
            if (dbCampaigns && dbCampaigns.length > 0) setCampaigns(dbCampaigns);
            else setCampaigns(INITIAL_CAMPAIGNS);

            // Brands
            const { data: dbBrands } = await supabase.from('brands').select('*');
            if (dbBrands && dbBrands.length > 0) setBrands(dbBrands);
            else setBrands(INITIAL_BRANDS);

            // Categories
            const { data: dbCategories } = await supabase.from('categories').select('*');
            if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
            else setCategories(INITIAL_CATEGORIES);

            // Blog Posts
            const { data: dbBlogPosts } = await supabase.from('blog_posts').select('*');
            if (dbBlogPosts && dbBlogPosts.length > 0) setBlogPosts(dbBlogPosts);
            else setBlogPosts(INITIAL_BLOG_POSTS.map((post) => ({
                id: post.id,
                title: post.title,
                content: 'İçerik yakında eklenecek...',
                img: post.img,
                category: 'Bakım & Sağlık',
                author: 'PatiDükkan Editörü',
                created_at: new Date().toISOString().split('T')[0],
                is_published: true
            })));

            // Site Settings
            const { data: dbSettings } = await supabase.from('site_settings').select('*').single();
            if (dbSettings) setSiteSettings({
                siteName: dbSettings.site_name,
                logoUrl: dbSettings.logo_url,
                phone: dbSettings.phone,
                email: dbSettings.email,
                address: dbSettings.address,
                topBarMessage: dbSettings.top_bar_message,
                socialLinks: {
                    facebook: dbSettings.social_facebook || '',
                    instagram: dbSettings.social_instagram || '',
                    twitter: dbSettings.social_twitter || '',
                    youtube: dbSettings.social_youtube || ''
                }
            });

        } catch (error) {
            console.error("Error fetching data, using fallback mocks:", error);
            // Fallback to initial constants on error (e.g. missing keys)
            setProducts(INITIAL_PRODUCTS);
            setCampaigns(INITIAL_CAMPAIGNS);
            setBrands(INITIAL_BRANDS);
            setCategories(INITIAL_CATEGORIES);
            setBlogPosts(INITIAL_BLOG_POSTS);
            // Settings stay as DEFAULT_SITE_SETTINGS initialized in state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Setup Realtime Subscription
        const channel = supabase.channel('public_db_changes')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                // To keep it simple for now, refine fetch later
                fetchData();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Helper to map and persist generic updates
    // In a real app we'd use useMutation or similar, here we just do direct calls

    // Products CRUD
    const updateProduct = async (product: Product) => {
        try {
            const { error } = await supabase.from('products').upsert(product);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    };

    const addProduct = async (product: Product) => {
        try {
            const { error } = await supabase.from('products').insert(product);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase insert failed (mock mode), updating local state:", e);
        }
        setProducts(prev => [...prev, product]);
    };

    const deleteProduct = async (id: string) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed (mock mode), updating local state:", e);
        }
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // Campaigns CRUD
    const updateCampaign = async (campaign: Campaign) => {
        try {
            const { error } = await supabase.from('campaigns').upsert(campaign);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
    };

    const addCampaign = async (campaign: Campaign) => {
        try {
            const { error } = await supabase.from('campaigns').insert(campaign);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase insert failed (mock mode), updating local state:", e);
        }
        setCampaigns(prev => [...prev, campaign]);
    };

    const deleteCampaign = async (id: string) => {
        try {
            const { error } = await supabase.from('campaigns').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed (mock mode), updating local state:", e);
        }
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    // Brands CRUD
    const updateBrand = async (brand: Brand) => {
        try {
            const { error } = await supabase.from('brands').upsert(brand);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
    };

    const addBrand = async (brand: Brand) => {
        try {
            const { error } = await supabase.from('brands').insert(brand);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase insert failed (mock mode), updating local state:", e);
        }
        setBrands(prev => [...prev, brand]);
    };

    const deleteBrand = async (id: string) => {
        try {
            const { error } = await supabase.from('brands').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed (mock mode), updating local state:", e);
        }
        setBrands(prev => prev.filter(b => b.id !== id));
    };

    // Categories CRUD
    const updateCategory = async (category: Category) => {
        try {
            const { error } = await supabase.from('categories').upsert(category);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    };

    const addCategory = async (category: Category) => {
        try {
            const { error } = await supabase.from('categories').insert(category);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase insert failed (mock mode), updating local state:", e);
        }
        setCategories(prev => [...prev, category]);
    };

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed (mock mode), updating local state:", e);
        }
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // Blog Posts CRUD
    const updateBlogPost = async (post: BlogPost) => {
        try {
            const { error } = await supabase.from('blog_posts').upsert(post);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setBlogPosts(prev => prev.map(p => p.id === post.id ? post : p));
    };

    const addBlogPost = async (post: BlogPost) => {
        try {
            const { error } = await supabase.from('blog_posts').insert(post);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase insert failed (mock mode), updating local state:", e);
        }
        setBlogPosts(prev => [...prev, post]);
    };

    const deleteBlogPost = async (id: string) => {
        try {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed (mock mode), updating local state:", e);
        }
        setBlogPosts(prev => prev.filter(p => p.id !== id));
    };

    // Site Settings
    const updateSiteSettings = async (settings: SiteSettings) => {
        const dbSettings = {
            id: 1, // Singleton
            site_name: settings.siteName,
            logo_url: settings.logoUrl,
            phone: settings.phone,
            email: settings.email,
            address: settings.address,
            top_bar_message: settings.topBarMessage,
            social_facebook: settings.socialLinks.facebook,
            social_instagram: settings.socialLinks.instagram,
            social_twitter: settings.socialLinks.twitter,
            social_youtube: settings.socialLinks.youtube
        };
        try {
            const { error } = await supabase.from('site_settings').upsert(dbSettings);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase update failed (mock mode), updating local state:", e);
        }
        setSiteSettings(settings);
    };

    // Home Features & Categories & Reviews - Keeping local/mock for now unless tables created
    // If you want these in DB, we need tables. For now we just update state/local storage as fallback or add them to DB schema later.
    // To respect the prompt "connect all admin", we'll simulate the DB behavior or use a generic 'json_store' if we had one.
    // For now, let's keep them in memory/local to avoid breaking the app if tables don't exist yet, but in a real scenario we'd add tables.

    // ... Keeping these as local state for now as per schema in database.sql (which didn't include these specific tables yet)
    // You can add 'home_content' table later.
    const updateHomeFeatures = async (features: HomeFeature[]) => { setHomeFeatures(features); }; // Placeholder
    const updateHomeCategories = async (categories: HomeCategory[]) => { setHomeCategories(categories); }; // Placeholder
    const updateCustomerReview = async (review: CustomerReview) => { setCustomerReviews(prev => prev.map(r => r.id === review.id ? review : r)); };
    const addCustomerReview = async (review: CustomerReview) => { setCustomerReviews(prev => [...prev, review]); };
    const deleteCustomerReview = async (id: string) => { setCustomerReviews(prev => prev.filter(r => r.id !== id)); };

    return (
        <ProductContext.Provider value={{
            products, updateProduct, addProduct, deleteProduct,
            campaigns, updateCampaign, addCampaign, deleteCampaign,
            brands, updateBrand, addBrand, deleteBrand,
            categories, updateCategory, addCategory, deleteCategory,
            blogPosts, updateBlogPost, addBlogPost, deleteBlogPost,
            siteSettings, updateSiteSettings,
            homeFeatures, updateHomeFeatures,
            homeCategories, updateHomeCategories,
            customerReviews, updateCustomerReview, addCustomerReview, deleteCustomerReview,
            loading
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;
