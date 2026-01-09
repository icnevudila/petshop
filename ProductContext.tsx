
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Campaign, Brand, Category, BlogPost, SiteSettings, HomeFeature, HomeCategory, CustomerReview } from './types';
import { supabase } from './supabaseClient';
import { PRODUCTS as INITIAL_PRODUCTS, CAMPAIGNS as INITIAL_CAMPAIGNS, BRANDS as INITIAL_BRANDS, CATEGORY_DATA as INITIAL_CATEGORIES, BLOG_POSTS as INITIAL_BLOG_POSTS } from './constants';
import { getCampaigns, addCampaign as addCampaignService, updateCampaign as updateCampaignService, deleteCampaign as deleteCampaignService } from './services/campaignService';
import { getBlogPosts, addBlogPost as addBlogPostService, updateBlogPost as updateBlogPostService, deleteBlogPost as deleteBlogPostService } from './services/blogService';

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
    { id: 'hc2', title: 'YAVRU KEDİ', img: '/menu_images/menu_kitten_food_1767813788837.png', link: '/kategori/yavru-kedi', order: 2 },
    { id: 'hc3', title: 'KÖPEK', img: '/menu_images/menu_adult_dog_food_1767814113679.png', link: '/kategori/kopek', order: 3 },
    { id: 'hc4', title: 'YAVRU KÖPEK', img: '/menu_images/menu_puppy_food_1767814099784.png', link: '/kategori/yavru-kopek', order: 4 }
];

const DEFAULT_CUSTOMER_REVIEWS: CustomerReview[] = [
    { id: 'cr1', user: 'Zeynep Yılmaz', pet: 'Mırnav', message: 'Kedim mama konusunda çok seçici, N&D\'nin bu serisine bayıldı. Paketleme her zamanki gibi çok sağlamdı.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 'cr2', user: 'Murat Kaya', pet: 'Zeus', message: 'Sipariş verdiğim gün kargoya verildi. Ertesi gün elimdeydi. Küçük hediyeleriniz için teşekkürler, köpeğim çok sevdi :)', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'cr3', user: 'Ayşe Demir', pet: 'Limon', message: 'Kuşumun yemini hep buradan alıyorum. Hem taze hem de piyasaya göre çok uygun. Güvenilir esnaf.', img: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
    { id: 'cr4', user: 'Burak Şahin', pet: 'Max', message: 'Büyük ırk köpeğim için dayanıklı oyuncak bulamıyordum, aldığım halat oyuncak 3 aydır sapasağlam.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024e' },
    { id: 'cr5', user: 'Selin Çelik', pet: 'Mia', message: 'Kum siparişi verirken tedirgindim ama paketleme harikaydı, hiç dökülmeden geldi. Teşekkürler PatiDükkan.', img: 'https://i.pravatar.cc/150?u=a042581f4e290260250' },
    { id: 'cr6', user: 'Emre Koç', pet: 'Poyraz', message: 'Müşteri hizmetleri çok ilgili. Yanlış ürün sipariş etmişim, hemen değişim için yardımcı oldular. Artık favori sitem.', img: 'https://i.pravatar.cc/150?u=a042581f4e290260251' },
    { id: 'cr7', user: 'Gamze Öztürk', pet: 'Gölge', message: 'Ürünlerin son kullanma tarihleri epey ileri, güvenle stok yapabiliyorum. Kedi multivitaminleri çok işe yaradı.', img: 'https://i.pravatar.cc/150?u=a042581f4e290260252' },
    { id: 'cr8', user: 'Volkan Arslan', pet: 'Duman', message: 'Akvaryum bitkilerim çok sağlıklı geldi, formları bozulmamış. Canlı desteğin tavsiyeleri için de ayrıca teşekkürler.', img: 'https://i.pravatar.cc/150?u=a042581f4e290260253' }
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

    // Initial Fetch from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Products
                const { data: productsData } = await supabase.from('products').select('*').eq('is_active', true);
                if (productsData) {
                    setProducts(productsData.map(p => ({
                        ...p,
                        price: parseFloat(p.price),
                        discounted_price: p.discounted_price ? parseFloat(p.discounted_price) : null,
                        rating: parseFloat(p.rating),
                        images: p.images || [],
                        tags: p.tags || [],
                        features: p.features || []
                    })));
                } else {
                    setProducts(INITIAL_PRODUCTS); // Fallback
                }

                // Fetch Brands
                const { data: brandsData } = await supabase.from('brands').select('*');
                if (brandsData && brandsData.length > 0) {
                    setBrands(brandsData);
                } else {
                    setBrands(INITIAL_BRANDS);
                }

                // Fetch Categories
                const { data: categoriesData } = await supabase.from('categories').select('*');
                if (categoriesData && categoriesData.length > 0) {
                    setCategories(categoriesData);
                } else {
                    setCategories(INITIAL_CATEGORIES);
                }

                // Fetch Campaigns
                try {
                    const campaignsData = await getCampaigns();
                    if (campaignsData.length > 0) setCampaigns(campaignsData);
                    else setCampaigns(INITIAL_CAMPAIGNS);
                } catch {
                    setCampaigns(INITIAL_CAMPAIGNS);
                }

                // Fetch Blog Posts
                try {
                    const blogData = await getBlogPosts();
                    if (blogData.length > 0) setBlogPosts(blogData);
                    else setBlogPosts(INITIAL_BLOG_POSTS);
                } catch {
                    // Fallback
                    setBlogPosts(INITIAL_BLOG_POSTS.map((post) => ({
                        id: post.id,
                        title: post.title,
                        content: 'İçerik yakında eklenecek...',
                        img: post.img,
                        category: post.category,
                        author: post.author,
                        created_at: post.date,
                        is_published: true,
                        slug: post.title.toLowerCase().replace(/ /g, '-')
                    })));
                }

                // Other settings from LocalStorage for now
                const loadFromStorage = (key: string, fallback: any) => {
                    const saved = localStorage.getItem(key);
                    return saved ? JSON.parse(saved) : fallback;
                };

                setSiteSettings(loadFromStorage('siteSettings', DEFAULT_SITE_SETTINGS));
                setHomeFeatures(loadFromStorage('homeFeatures', DEFAULT_HOME_FEATURES));
                setHomeCategories(loadFromStorage('homeCategories', DEFAULT_HOME_CATEGORIES));
                setCustomerReviews(loadFromStorage('customerReviews', DEFAULT_CUSTOMER_REVIEWS));

            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to persist to localStorage (for non-database items)
    const persist = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // PRODUCTS CRUD
    const updateProduct = async (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        try {
            await supabase.from('products').update({ ...product }).eq('id', product.id);
        } catch (e) { console.error('Supabase update failed:', e); }
    };
    const addProduct = async (product: Product) => {
        setProducts(prev => [...prev, product]);
        try {
            await supabase.from('products').insert(product);
        } catch (e) { console.error('Supabase insert failed:', e); }
    };
    const deleteProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            await supabase.from('products').delete().eq('id', id);
        } catch (e) { console.error('Supabase delete failed:', e); }
    };

    // CAMPAIGNS CRUD (Using Service)
    const updateCampaign = async (campaign: Campaign) => {
        setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
        try { await updateCampaignService(campaign); }
        catch (e) { console.error('Supabase campaign update failed:', e); }
    };
    const addCampaign = async (campaign: Campaign) => {
        setCampaigns(prev => [...prev, campaign]);
        try { await addCampaignService(campaign); }
        catch (e) { console.error('Supabase campaign add failed:', e); }
    };
    const deleteCampaign = async (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        try { await deleteCampaignService(id); }
        catch (e) { console.error('Supabase campaign delete failed:', e); }
    };

    // BRANDS CRUD
    const updateBrand = async (brand: Brand) => {
        setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
        try { await supabase.from('brands').update({ name: brand.name, logo_url: brand.logo_url }).eq('id', brand.id); }
        catch (e) { console.error('Supabase brand update failed:', e); }
    };
    const addBrand = async (brand: Brand) => {
        setBrands(prev => [...prev, brand]);
        try { await supabase.from('brands').insert(brand); }
        catch (e) { console.error('Supabase brand insert failed:', e); }
    };
    const deleteBrand = async (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
        try { await supabase.from('brands').delete().eq('id', id); }
        catch (e) { console.error('Supabase brand delete failed:', e); }
    };

    // CATEGORIES CRUD
    const updateCategory = async (category: Category) => {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        try { await supabase.from('categories').update({ name: category.name, parent_id: category.parent_id }).eq('id', category.id); }
        catch (e) { console.error('Supabase category update failed:', e); }
    };
    const addCategory = async (category: Category) => {
        setCategories(prev => [...prev, category]);
        try { await supabase.from('categories').insert(category); }
        catch (e) { console.error('Supabase category insert failed:', e); }
    };
    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        try { await supabase.from('categories').delete().eq('id', id); }
        catch (e) { console.error('Supabase category delete failed:', e); }
    };

    // BLOG CRUD (Using Service)
    const updateBlogPost = async (post: BlogPost) => {
        setBlogPosts(prev => prev.map(p => p.id === post.id ? post : p));
        try { await updateBlogPostService(post); }
        catch (e) { console.error('Supabase blog update failed:', e); }
    };
    const addBlogPost = async (post: BlogPost) => {
        // We'll re-fetch to get the proper schema back usually, but optimistic update is fine
        try {
            await addBlogPostService(post);
            const data = await getBlogPosts();
            setBlogPosts(data);
        } catch (e) { console.error('Supabase blog add failed:', e); }
    };
    const deleteBlogPost = async (id: string) => {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
        try { await deleteBlogPostService(id); }
        catch (e) { console.error('Supabase blog delete failed:', e); }
    };

    // SETTINGS (Local Storage)
    const updateSiteSettings = async (settings: SiteSettings) => {
        setSiteSettings(settings);
        persist('siteSettings', settings);
    };

    // HOME CONTENT (Local Storage)
    const updateHomeFeatures = async (features: HomeFeature[]) => {
        setHomeFeatures(features);
        persist('homeFeatures', features);
    };
    const updateHomeCategories = async (categories: HomeCategory[]) => {
        setHomeCategories(categories);
        persist('homeCategories', categories);
    };
    const updateCustomerReview = async (review: CustomerReview) => {
        setCustomerReviews(prev => {
            const next = prev.map(r => r.id === review.id ? review : r);
            persist('customerReviews', next);
            return next;
        });
    };
    const addCustomerReview = async (review: CustomerReview) => {
        setCustomerReviews(prev => {
            const next = [...prev, review];
            persist('customerReviews', next);
            return next;
        });
    };
    const deleteCustomerReview = async (id: string) => {
        setCustomerReviews(prev => {
            const next = prev.filter(r => r.id !== id);
            persist('customerReviews', next);
            return next;
        });
    };

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
