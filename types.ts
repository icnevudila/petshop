
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

// B2B Dealer Types
export type DealerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type DealerOrderStatus = 'Beklemede' | 'Onaylandı' | 'Hazırlanıyor' | 'Kargolandı' | 'Teslim Edildi' | 'İptal Edildi';

export interface Dealer {
  id: string;
  user_id: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  company_address: string;
  company_phone: string;
  city: string;
  district: string;
  discount_rate: number;
  min_order_amount: number;
  status: DealerStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface DealerOrder {
  id: string;
  dealer_id: string;
  status: DealerOrderStatus;
  total_price: number;
  discount_applied: number;
  shipping_address: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  items?: DealerOrderItem[];
  dealer?: Dealer;
}

export interface DealerOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discounted_unit_price: number;
}

export interface B2BCartEntry {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discounted_unit_price: number;
  images?: string[];
}
