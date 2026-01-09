import React, { useState, useMemo } from 'react';
import { useProducts } from '../ProductContext';
import ProductCard from '../components/ProductCard';
import {
  LayoutDashboard, Package, Plus, Search, Edit3, Trash2,
  X, Save, ChevronDown, Settings, Star, Upload,
  Image, Tag, Folder, FileText, Home, Check, ShoppingBag
} from 'lucide-react';
import { Product, Campaign, Brand, Category, BlogPost, SiteSettings } from '../types';

// Mock Data for Orders (until integrated with backend)
const MOCK_ORDERS = [
  { id: 'ORD-1001', customer_name: 'Ahmet Yılmaz', customer_email: 'ahmet@example.com', customer_phone: '0555 555 55 55', total_price: 450, status: 'Kargolandı', address_info: 'Kadıköy, İstanbul', created_at: '2024-01-15' },
  { id: 'ORD-1002', customer_name: 'Ayşe Demir', customer_email: 'ayse@example.com', customer_phone: '0544 444 44 44', total_price: 1250, status: 'Hazırlanıyor', address_info: 'Çankaya, Ankara', created_at: '2024-01-16' },
];

type TabType = 'dashboard' | 'products' | 'campaigns' | 'brands' | 'categories' | 'blog' | 'homepage' | 'settings' | 'orders';

// Simple Error Boundary to catch render errors in tabs
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Admin Page Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100 m-4">
          <div className="text-red-500 font-bold mb-2">Bir hata oluştu.</div>
          <p className="text-sm text-gray-600 mb-4">Bu sekme görüntülenirken bir sorun yaşandı. Lütfen sayfayı yenileyin.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
//... (rest of imports)


const AdminPage: React.FC = () => {
  const {
    products, addProduct, updateProduct, deleteProduct,
    campaigns, addCampaign, updateCampaign, deleteCampaign,
    brands, addBrand, updateBrand, deleteBrand,
    categories, addCategory, updateCategory, deleteCategory,
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    siteSettings, updateSiteSettings,
    homeFeatures, updateHomeFeatures,
    homeCategories, updateHomeCategories,
    customerReviews, updateCustomerReview, addCustomerReview, deleteCustomerReview
  } = useProducts();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', price: '', discounted_price: '', stock: '', brand: '', category: '',
    description: '', tags: [] as string[], isActive: true, features: [] as string[], images: [] as string[]
  });
  const [campaignForm, setCampaignForm] = useState({ title: '', image_url: '', target_url: '', location: 'slider' as const });
  const [brandForm, setBrandForm] = useState({ name: '', slug: '', logo_url: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', parent_id: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', img: '', category: '', author: '', is_published: true });
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Stats - Only real data
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.is_active).length,
    totalBrands: brands.length,
    totalCategories: categories.length,
    totalCampaigns: campaigns.length,
    totalBlogPosts: blogPosts.length,
    totalReviews: customerReviews.length
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Ürünler', icon: Package },
    { id: 'campaigns', label: 'Bannerlar', icon: Image },
    { id: 'brands', label: 'Markalar', icon: Tag },
    { id: 'categories', label: 'Kategoriler', icon: Folder },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'homepage', label: 'Anasayfa', icon: Home },
    { id: 'orders', label: 'Siparişler', icon: ShoppingBag },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  // Filtered data
  const filteredProducts = useMemo(() => products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, products]);

  const filteredCampaigns = useMemo(() => campaigns.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, campaigns]);

  const filteredBrands = useMemo(() => brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, brands]);

  // Open modal handlers
  const openAddModal = (type: string) => {
    setModalType(type);
    setEditingItem(null);
    resetForms();
    setIsModalOpen(true);
  };

  const openEditModal = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'product') {
      setProductForm({
        name: item.name, price: item.price.toString(), discounted_price: item.discounted_price?.toString() || '',
        stock: item.stock.toString(), brand: item.brand_id, category: item.category_id,
        description: item.description, tags: [...item.tags], isActive: item.is_active,
        features: [...item.features], images: [...item.images]
      });
    } else if (type === 'campaign') {
      setCampaignForm({ title: item.title, image_url: item.image_url, target_url: item.target_url, location: item.location });
    } else if (type === 'brand') {
      setBrandForm({ name: item.name, slug: item.slug, logo_url: item.logo_url });
    } else if (type === 'category') {
      setCategoryForm({ name: item.name, slug: item.slug, parent_id: item.parent_id || '' });
    } else if (type === 'blog') {
      setBlogForm({ title: item.title, content: item.content, img: item.img, category: item.category, author: item.author, is_published: item.is_published });
    }
    setIsModalOpen(true);
  };

  const resetForms = () => {
    setProductForm({ name: '', price: '', discounted_price: '', stock: '', brand: '', category: '', description: '', tags: [], isActive: true, features: [], images: [] });
    setCampaignForm({ title: '', image_url: '', target_url: '', location: 'slider' });
    setBrandForm({ name: '', slug: '', logo_url: '' });
    setCategoryForm({ name: '', slug: '', parent_id: '' });
    setBlogForm({ title: '', content: '', img: '', category: '', author: '', is_published: true });
    setNewTag(''); setNewFeature(''); setNewImage('');
  };

  // Save handlers
  const handleSaveProduct = async () => {
    const productData: Product = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: productForm.description,
      price: parseFloat(productForm.price),
      discounted_price: productForm.discounted_price ? parseFloat(productForm.discounted_price) : null,
      stock: parseInt(productForm.stock),
      brand_id: productForm.brand,
      brand_name: brands.find(b => b.id === productForm.brand)?.name || 'Generic',
      category_id: productForm.category,
      images: productForm.images.length > 0 ? productForm.images : ['https://via.placeholder.com/400'],
      tags: productForm.tags,
      is_active: productForm.isActive,
      features: productForm.features,
      rating: editingItem?.rating || 4.5,
      review_count: editingItem?.review_count || 0
    };
    try {
      if (editingItem) await updateProduct(productData); else await addProduct(productData);
      showNotification(editingItem ? 'Ürün güncellendi!' : 'Ürün eklendi!', 'success');
      setIsModalOpen(false);
    } catch (e) {
      showNotification('Hata oluştu', 'error');
    }
  };

  const handleSaveCampaign = async () => {
    if (!campaignForm.target_url) {
      showNotification('Lütfen banner için bir hedef link seçin!', 'error');
      return;
    }
    const campaignData: Campaign = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      title: campaignForm.title,
      image_url: campaignForm.image_url,
      target_url: campaignForm.target_url,
      location: campaignForm.location
    };
    if (editingItem) await updateCampaign(campaignData); else await addCampaign(campaignData);
    showNotification(editingItem ? 'Banner güncellendi!' : 'Banner eklendi!', 'success');
    setIsModalOpen(false);
  };

  const handleSaveBrand = async () => {
    const brandData: Brand = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      name: brandForm.name,
      slug: brandForm.slug || brandForm.name.toLowerCase().replace(/ /g, '-'),
      logo_url: brandForm.logo_url
    };
    if (editingItem) await updateBrand(brandData); else await addBrand(brandData);
    showNotification(editingItem ? 'Marka güncellendi!' : 'Marka eklendi!', 'success');
    setIsModalOpen(false);
  };

  const handleSaveCategory = async () => {
    const categoryData: Category = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/ /g, '-'),
      parent_id: categoryForm.parent_id || null
    };
    if (editingItem) await updateCategory(categoryData); else await addCategory(categoryData);
    showNotification(editingItem ? 'Kategori güncellendi!' : 'Kategori eklendi!', 'success');
    setIsModalOpen(false);
  };

  const handleSaveBlog = async () => {
    const blogData: BlogPost = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      title: blogForm.title,
      content: blogForm.content,
      img: blogForm.img,
      category: blogForm.category,
      author: blogForm.author || 'Admin',
      created_at: editingItem?.created_at || new Date().toISOString().split('T')[0],
      is_published: blogForm.is_published
    };
    if (editingItem) await updateBlogPost(blogData); else await addBlogPost(blogData);
    showNotification(editingItem ? 'Yazı güncellendi!' : 'Yazı eklendi!', 'success');
    setIsModalOpen(false);
  };

  const handleSaveSettings = () => {
    updateSiteSettings(settingsForm);
    showNotification('Site ayarları güncellendi!', 'success');
  };

  // Delete handlers
  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      if (type === 'product') await deleteProduct(id);
      else if (type === 'campaign') await deleteCampaign(id);
      else if (type === 'brand') await deleteBrand(id);
      else if (type === 'category') await deleteCategory(id);
      else if (type === 'blog') await deleteBlogPost(id);
      showNotification('Silindi!', 'success');
    } catch (e) {
      showNotification('Hata oluştu', 'error');
    }
  };

  const addTagHandler = () => { if (newTag.trim() && !productForm.tags.includes(newTag.trim())) { setProductForm({ ...productForm, tags: [...productForm.tags, newTag.trim()] }); setNewTag(''); } };
  const addFeatureHandler = () => { if (newFeature.trim()) { setProductForm({ ...productForm, features: [...productForm.features, newFeature.trim()] }); setNewFeature(''); } };
  const addImageHandler = () => { if (newImage.trim()) { setProductForm({ ...productForm, images: [...productForm.images, newImage.trim()] }); setNewImage(''); } };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-gray-500 mb-1">{label}</p><p className="text-xl font-black text-secondary">{value}</p></div>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}><Icon size={20} className="text-white" /></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      {notification && (
        <div className={`fixed top-32 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <Check size={18} /> {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-secondary">Yönetim Paneli</h1>
            <p className="text-gray-500 text-sm">PatiDükkan Site Yönetimi</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1.5 rounded-xl border border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <ErrorBoundary>
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Package} label="Toplam Ürün" value={stats.totalProducts} color="bg-blue-500" />
                <StatCard icon={Star} label="Aktif Ürün" value={stats.activeProducts} color="bg-green-500" />
                <StatCard icon={Tag} label="Marka" value={stats.totalBrands} color="bg-purple-500" />
                <StatCard icon={Folder} label="Kategori" value={stats.totalCategories} color="bg-indigo-500" />
                <StatCard icon={Image} label="Banner" value={stats.totalCampaigns} color="bg-pink-500" />
                <StatCard icon={FileText} label="Blog Yazısı" value={stats.totalBlogPosts} color="bg-teal-500" />
                <StatCard icon={Star} label="Müşteri Yorumu" value={stats.totalReviews} color="bg-amber-500" />
                <StatCard icon={Home} label="Anasayfa Özellik" value={homeFeatures.length} color="bg-cyan-500" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openAddModal('product')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1">
                  <Plus size={18} /> Yeni Ürün Ekle
                </button>
                <button onClick={() => openAddModal('campaign')} className="flex items-center gap-2 bg-white border-2 border-primary text-primary px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all">
                  <Image size={18} /> Yeni Banner Ekle
                </button>
                <button onClick={() => openAddModal('blog')} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                  <FileText size={18} /> Yeni Blog Yazısı
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-secondary mb-4">Aktif Ürünler ({products.filter(p => !p.isActive || p.is_active).length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter(p => p.is_active).map(product => {
                    const brand = brands.find(b => b.id === product.brand_id)?.name || 'Marka Yok';
                    const category = categories.find(c => c.id === product.category_id)?.name || 'Kategori Yok';

                    return (
                      <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 relative overflow-hidden">
                            <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute top-1 left-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold text-secondary border border-gray-100 shadow-sm">
                              {product.images?.length || 0} Görsel
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{category}</span>
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">{brand}</span>
                            </div>
                            <h4 className="font-bold text-secondary text-sm leading-tight mb-2 line-clamp-2" title={product.name}>{product.name}</h4>
                            <div className="flex items-baseline gap-2">
                              {product.discounted_price ? (
                                <>
                                  <span className="text-xs text-gray-400 line-through">₺{product.price}</span>
                                  <span className="font-black text-lg text-primary">₺{product.discounted_price}</span>
                                </>
                              ) : (
                                <span className="font-black text-lg text-secondary">₺{product.price}</span>
                              )}
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-1">
                              Stok: <span className={product.stock < 10 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{product.stock} adet</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Area */}
                        <button
                          onClick={() => openEditModal('product', product)}
                          className="w-full py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-blue-100"
                        >
                          <Edit3 size={16} /> Düzenle & Detaylar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Ürün ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <button onClick={() => openAddModal('product')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                  <Plus size={18} /> Yeni Ürün
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-4 font-bold text-gray-500 text-xs uppercase">Ürün</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-500 text-xs uppercase">Marka</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-500 text-xs uppercase">Fiyat</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-500 text-xs uppercase">Stok</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-500 text-xs uppercase">Durum</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-500 text-xs uppercase">İşlem</th>
                  </tr></thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4"><div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                            {!product.is_active && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg"><span className="text-[10px] font-bold text-gray-500">PASİF</span></div>}
                          </div>
                          <div><p className="font-bold text-secondary text-sm">{(product.name || 'İsimsiz Ürün').substring(0, 35)}...</p><p className="text-xs text-gray-500">{product.category_id}</p></div>
                        </div></td>
                        <td className="py-4 px-4"><span className="text-sm font-medium text-gray-700">{product.brand_name}</span></td>
                        <td className="py-4 px-4"><div>
                          {product.discounted_price && <span className="text-xs text-gray-400 line-through block">₺{product.price}</span>}
                          <span className="font-bold text-secondary">₺{product.discounted_price || product.price}</span>
                        </div></td>
                        <td className="py-4 px-4"><span className={`font-medium ${product.stock < 20 ? 'text-red-500' : 'text-green-600'}`}>{product.stock} adet</span></td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => updateProduct({ ...product, is_active: !product.is_active })}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
                          >
                            {product.is_active ? 'Aktif' : 'Pasif'}
                          </button>
                        </td>
                        <td className="py-4 px-4"><div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal('product', product)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete('product', product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Campaigns/Banners Tab */}
          {activeTab === 'campaigns' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-secondary">Banner & Slider Yönetimi</h3>
                <button onClick={() => openAddModal('campaign')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                  <Plus size={18} /> Yeni Banner
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                    <div className="aspect-video bg-gray-100 relative">
                      <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal('campaign', campaign)} className="p-2 bg-white rounded-lg text-blue-500"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete('campaign', campaign.id)} className="p-2 bg-white rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-secondary text-sm truncate">{campaign.title}</p>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full mt-2 inline-block">{campaign.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brands Tab */}
          {activeTab === 'brands' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-secondary">Marka Yönetimi</h3>
                <button onClick={() => openAddModal('brand')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                  <Plus size={18} /> Yeni Marka
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredBrands.map(brand => (
                  <div key={brand.id} className="border border-gray-100 rounded-xl p-4 group hover:border-primary/30 transition-all">
                    <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                      <img src={brand.logo_url} alt={brand.name} className="max-h-16 max-w-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal('brand', brand)} className="p-1.5 bg-white rounded-lg text-blue-500"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete('brand', brand.id)} className="p-1.5 bg-white rounded-lg text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="font-bold text-secondary text-sm text-center truncate">{brand.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-secondary">Kategori Yönetimi</h3>
                <button onClick={() => openAddModal('category')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                  <Plus size={18} /> Yeni Kategori
                </button>
              </div>
              <div className="space-y-2">
                {categories.filter(c => !c.parent_id).map(parent => (
                  <div key={parent.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Folder size={20} className="text-primary" />
                        <span className="font-bold text-secondary">{parent.name}</span>
                        <span className="text-xs text-gray-400">/{parent.slug}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal('category', parent)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete('category', parent.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="pl-8">
                      {categories.filter(c => c.parent_id === parent.id).map(child => (
                        <div key={child.id} className="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <ChevronDown size={14} className="text-gray-400 -rotate-90" />
                            <span className="text-sm text-gray-700">{child.name}</span>
                            <span className="text-xs text-gray-400">/{child.slug}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal('category', child)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete('category', child.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-secondary">Blog Yazıları</h3>
                <button onClick={() => openAddModal('blog')} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                  <Plus size={18} /> Yeni Yazı
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {blogPosts.map(post => (
                  <div key={post.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal('blog', post)} className="p-2 bg-white rounded-lg text-blue-500"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete('blog', post.id)} className="p-2 bg-white rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-bold uppercase">{post.category}</span>
                      <p className="font-bold text-secondary text-sm mt-1 line-clamp-2">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-2">{post.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Homepage Tab */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-secondary">Anasayfa Özellikleri (Hızlı Kargo vs.)</h3>
                  <button onClick={() => updateHomeFeatures([...homeFeatures, { id: `hf${Date.now()}`, icon: 'Gift', title: 'Yeni Özellik', description: 'Açıklama giriniz', order: homeFeatures.length + 1 }])}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-hover transition-all">
                    <Plus size={16} /> Ekle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {homeFeatures.map((feature, idx) => (
                    <div key={feature.id} className="border border-gray-100 rounded-xl p-4 relative group">
                      <button onClick={() => updateHomeFeatures(homeFeatures.filter(f => f.id !== feature.id))} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      <div className="mb-2">
                        <input type="text" value={feature.icon} onChange={(e) => {
                          const updated = [...homeFeatures];
                          updated[idx].icon = e.target.value;
                          updateHomeFeatures(updated);
                        }} className="text-xs font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 w-full mb-2" placeholder="Icon Name (lucide)" />
                      </div>
                      <input type="text" value={feature.title} onChange={(e) => {
                        const updated = [...homeFeatures];
                        updated[idx].title = e.target.value;
                        updateHomeFeatures(updated);
                      }} className="w-full font-bold text-secondary mb-2 border-b border-transparent focus:border-primary outline-none" />
                      <input type="text" value={feature.description} onChange={(e) => {
                        const updated = [...homeFeatures];
                        updated[idx].description = e.target.value;
                        updateHomeFeatures(updated);
                      }} className="w-full text-sm text-gray-500 border-b border-transparent focus:border-primary outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-secondary">Hızlı Erişim Kategorileri</h3>
                  <button onClick={() => updateHomeCategories([...homeCategories, { id: `hc${Date.now()}`, title: 'Yeni Kategori', img: 'https://via.placeholder.com/300', link: '/', order: homeCategories.length + 1 }])}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-hover transition-all">
                    <Plus size={16} /> Ekle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {homeCategories.map((cat, idx) => (
                    <div key={cat.id} className="border border-gray-100 rounded-xl p-4 relative group">
                      <button onClick={() => updateHomeCategories(homeCategories.filter(c => c.id !== cat.id))} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={14} /></button>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
                      </div>
                      <input type="text" value={cat.title} placeholder="Başlık" onChange={(e) => {
                        const updated = [...homeCategories];
                        updated[idx].title = e.target.value;
                        updateHomeCategories(updated);
                      }} className="w-full font-bold text-secondary mb-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input type="text" value={cat.img} placeholder="Görsel URL" onChange={(e) => {
                        const updated = [...homeCategories];
                        updated[idx].img = e.target.value;
                        updateHomeCategories(updated);
                      }} className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 mb-2" />
                      <input type="text" value={cat.link} placeholder="Link" onChange={(e) => {
                        const updated = [...homeCategories];
                        updated[idx].link = e.target.value;
                        updateHomeCategories(updated);
                      }} className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-secondary">Müşteri Yorumları</h3>
                  <button onClick={() => addCustomerReview({ id: `cr${Date.now()}`, user: 'Yeni Müşteri', pet: 'Pet', message: 'Yorum...', img: 'https://i.pravatar.cc/150' })}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm"><Plus size={16} /> Ekle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {customerReviews.map((review, idx) => (
                    <div key={review.id} className="border border-gray-100 rounded-xl p-4 relative">
                      <button onClick={() => deleteCustomerReview(review.id)} className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded text-red-500"><X size={14} /></button>
                      <input type="text" value={review.user} onChange={(e) => updateCustomerReview({ ...review, user: e.target.value })} className="w-full font-bold text-secondary text-sm mb-1 border-b border-transparent focus:border-primary outline-none" />
                      <input type="text" value={review.pet} onChange={(e) => updateCustomerReview({ ...review, pet: e.target.value })} className="w-full text-xs text-gray-400 mb-2 border-b border-transparent focus:border-primary outline-none" placeholder="Pet ismi" />
                      <textarea value={review.message} onChange={(e) => updateCustomerReview({ ...review, message: e.target.value })} className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 resize-none h-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-secondary mb-4">Sipariş Yönetimi</h3>
              <div className="space-y-4">
                {MOCK_ORDERS.map(order => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><ShoppingBag size={20} className="text-primary" /></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-secondary">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-700' : order.status === 'Kargolandı' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                          </div>
                          <p className="font-medium text-secondary">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_email} • {order.customer_phone}</p>
                          <p className="text-sm text-gray-500 mt-1">{order.address_info}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-secondary">₺{order.total_price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{order.created_at}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-secondary mb-6">Site Ayarları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Site Adı</label>
                  <input type="text" value={settingsForm.siteName} onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                  <input type="text" value={settingsForm.logoUrl} onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                  <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                  <input type="text" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adres</label>
                  <input type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Üst Bar Mesajı</label>
                  <input type="text" value={settingsForm.topBarMessage} onChange={(e) => setSettingsForm({ ...settingsForm, topBarMessage: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Facebook</label>
                  <input type="text" value={settingsForm.socialLinks.facebook} onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value } })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label>
                  <input type="text" value={settingsForm.socialLinks.instagram} onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
              </div>
              <button onClick={handleSaveSettings} className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all">
                <Save size={18} /> Ayarları Kaydet
              </button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className={`bg-white rounded-2xl w-full ${modalType === 'product' ? 'max-w-6xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                  <h3 className="text-xl font-black text-secondary">
                    {editingItem ? 'Düzenle' : 'Yeni Ekle'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {modalType === 'product' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Form Section */}
                      <div className="lg:col-span-2 space-y-4">
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Ürün Adı</label>
                          <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">Fiyat (₺)</label>
                            <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">İndirimli Fiyat</label>
                            <input type="number" value={productForm.discounted_price} onChange={(e) => setProductForm({ ...productForm, discounted_price: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                            {productForm.discounted_price && <p className="text-xs text-green-600 mt-1 font-bold">✨ Günün Fırsatları alanında görünecek.</p>}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">Marka</label>
                            <select value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                              <option value="">Seçin</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                            <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                              <option value="">Seçin</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        </div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                          <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Açıklama</label>
                          <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl h-24 resize-none" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Görseller</label>
                          <div className="flex gap-2 mb-2">
                            <input type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Görsel URL yapıştır" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl" />
                            <label className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2">
                              <Upload size={16} /> Yükle
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      setProductForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }} />
                            </label>
                            <button onClick={addImageHandler} className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">Ekle</button>
                          </div>
                          <div className="flex flex-wrap gap-2">{productForm.images.map((img, i) => (
                            <div key={i} className="relative group"><img src={img} className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100" />
                              <button onClick={() => setProductForm({ ...productForm, images: productForm.images.filter((_, idx) => idx !== i) })} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"><X size={12} /></button></div>
                          ))}</div></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Özellikler (Maddeler)</label>
                          <div className="flex gap-2 mb-2"><input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Özellik ekle (örn: %100 Pamuk)" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl" />
                            <button onClick={addFeatureHandler} className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm">Ekle</button></div>
                          <div className="space-y-1">{productForm.features.map((feature, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-100">
                              <span className="text-gray-700">• {feature}</span>
                              <button onClick={() => setProductForm({ ...productForm, features: productForm.features.filter((_, idx) => idx !== i) })} className="text-red-500 font-bold hover:bg-red-50 p-1 rounded">×</button>
                            </div>
                          ))}</div></div>

                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Etiketler</label>
                          <div className="flex gap-2 mb-2"><input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Etiket ekle" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl" />
                            <button onClick={addTagHandler} className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm">Ekle</button></div>
                          <p className="text-xs text-gray-500 mb-2">💡 İpucu: <span className="font-bold text-gray-700">"Yavru"</span> etiketini eklerseniz ürün <span className="font-bold text-gray-700">Yavru Dostlar</span> bölümünde otomatik listelenir.</p>
                          <div className="flex flex-wrap gap-2">{productForm.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">{tag}
                              <button onClick={() => setProductForm({ ...productForm, tags: productForm.tags.filter(t => t !== tag) })} className="text-primary">×</button></span>
                          ))}</div></div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })} className="w-5 h-5" />
                          <label className="font-bold text-gray-700">Aktif</label></div>
                      </div>

                      {/* Live Preview Section */}
                      <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Canlı Önizleme</h4>
                          <div className="transform scale-90 origin-top pointer-events-none">
                            <ProductCard
                              product={{
                                id: 'preview',
                                name: productForm.name || 'Ürün Adı',
                                price: parseFloat(productForm.price) || 0,
                                discounted_price: productForm.discounted_price ? parseFloat(productForm.discounted_price) : null,
                                images: productForm.images.length > 0 ? productForm.images : ['https://via.placeholder.com/400'],
                                description: productForm.description,
                                stock: parseInt(productForm.stock) || 0,
                                brand_id: productForm.brand,
                                brand_name: brands.find(b => b.id === productForm.brand)?.name || 'Marka',
                                category_id: productForm.category,
                                tags: productForm.tags,
                                rating: 5,
                                review_count: 0,
                                is_active: productForm.isActive,
                                features: productForm.features || [],
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                              }}
                              onAddToCart={() => { }}
                              toggleWishlist={() => { }}
                              isWishlisted={false}
                              onQuickView={() => { }}
                            />
                          </div>
                          <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">Bu kart sitenizde müşterilerin göreceği tasarımdır.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalType === 'campaign' && (<>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Banner Başlığı</label>
                      <input type="text" value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Görsel URL</label>
                      <input type="text" value={campaignForm.image_url} onChange={(e) => setCampaignForm({ ...campaignForm, image_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                      {campaignForm.image_url && <img src={campaignForm.image_url} className="mt-2 w-full h-32 object-cover rounded-xl" />}</div>

                    {/* Smart Link Selector */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hedef Link</label>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <button onClick={() => setCampaignForm({ ...campaignForm, target_url: '' })} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${!campaignForm.target_url.startsWith('/urun') && !campaignForm.target_url.startsWith('/kategori') ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-200'}`}>Manuel/Dış</button>
                          <button onClick={() => setCampaignForm({ ...campaignForm, target_url: '/urun/' })} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${campaignForm.target_url.startsWith('/urun') ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-200'}`}>Ürün Linki</button>
                          <button onClick={() => setCampaignForm({ ...campaignForm, target_url: '/kategori/' })} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${campaignForm.target_url.startsWith('/kategori') ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-200'}`}>Kategori Linki</button>
                        </div>

                        {campaignForm.target_url.startsWith('/urun') ? (
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                            onChange={(e) => setCampaignForm({ ...campaignForm, target_url: `/urun/${e.target.value}` })}
                            value={campaignForm.target_url.replace('/urun/', '')}
                          >
                            <option value="">Ürün Seçiniz...</option>
                            {products.map(p => (
                              <option key={p.id} value={p.slug}>{p.name}</option>
                            ))}
                          </select>
                        ) : campaignForm.target_url.startsWith('/kategori') ? (
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                            onChange={(e) => setCampaignForm({ ...campaignForm, target_url: `/kategori/${e.target.value}` })}
                            value={campaignForm.target_url.replace('/kategori/', '')}
                          >
                            <option value="">Kategori Seçiniz...</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          <input type="text" value={campaignForm.target_url} onChange={(e) => setCampaignForm({ ...campaignForm, target_url: e.target.value })} placeholder="https://... veya /sayfa" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                        )}
                      </div>
                    </div>

                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Konum</label>
                      <select value={campaignForm.location} onChange={(e) => setCampaignForm({ ...campaignForm, location: e.target.value as any })} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                        <option value="slider">Ana Slider</option><option value="banner1">Banner 1</option><option value="banner2">Banner 2</option><option value="category">Kategori</option><option value="blog">Blog</option></select></div>
                  </>)}

                  {modalType === 'brand' && (<>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Marka Adı</label>
                      <input type="text" value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                      <input type="text" value={brandForm.slug} onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })} placeholder="marka-adi" className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                      <input type="text" value={brandForm.logo_url} onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                      {brandForm.logo_url && <img src={brandForm.logo_url} className="mt-2 h-16 object-contain" />}</div>
                  </>)}

                  {modalType === 'category' && (<>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Kategori Adı</label>
                      <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                      <input type="text" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} placeholder="kategori-adi" className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Üst Kategori</label>
                      <select value={categoryForm.parent_id} onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                        <option value="">Ana Kategori (Yok)</option>{categories.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  </>)}

                  {modalType === 'blog' && (<>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Yazı Başlığı</label>
                      <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">İçerik</label>
                      <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl h-32 resize-none" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Kapak Görseli URL</label>
                      <input type="text" value={blogForm.img} onChange={(e) => setBlogForm({ ...blogForm, img: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                      {blogForm.img && <img src={blogForm.img} className="mt-2 w-full h-32 object-cover rounded-xl" />}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                        <input type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">Yazar</label>
                        <input type="text" value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={blogForm.is_published} onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })} className="w-5 h-5" />
                      <label className="font-bold text-gray-700">Yayınla</label></div>
                  </>)}

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">İptal</button>
                    <button onClick={() => {
                      if (modalType === 'product') handleSaveProduct();
                      else if (modalType === 'campaign') handleSaveCampaign();
                      else if (modalType === 'brand') handleSaveBrand();
                      else if (modalType === 'category') handleSaveCategory();
                      else if (modalType === 'blog') handleSaveBlog();
                    }} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover flex items-center gap-2">
                      <Save size={18} /> Kaydet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AdminPage;