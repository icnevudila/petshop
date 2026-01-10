
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discounted_price: number | null;
  stock: number;
  brand_id: string;
  brand_name?: string;
  brand_logo_url?: string;
  category_id: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  rating: number;
  review_count: number;
  features: string[];
}

export interface Campaign {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  location: 'slider' | 'banner1' | 'banner2' | 'category' | 'blog' | 'promo';
  start_date?: string;
  end_date?: string;
  target_category_id?: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  status: 'Hazırlanıyor' | 'Kargolandı' | 'Teslim Edildi' | 'İptal Edildi';
  address_info: string;
  created_at: string;
}

export interface FilterState {
  brands: string[];
  age: string[];
  weight: string[];
  grain: string[];
  specialNeeds: string[];
}

// Extended types for Admin Panel
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  img: string;
  category: string;
  author: string;
  created_at: string;
  is_published: boolean;
  slug: string;
  tags?: string[];
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  topBarMessage: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export interface HomeFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface HomeCategory {
  id: string;
  title: string;
  img: string;
  link: string;
  order: number;
}

export interface CustomerReview {
  id: string;
  user: string;
  pet: string;
  message: string;
  img: string;
}

export interface CartEntry {
  product_id: string;
  quantity: number;
}
