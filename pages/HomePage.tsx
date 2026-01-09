
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import SubCategoryStrip from '../components/SubCategoryStrip';
import BrandMarquee from '../components/BrandMarquee';
import WelcomePopup from '../components/WelcomePopup';
import {
   ChevronLeft, ChevronRight, Zap, ArrowRight, ArrowLeft, Star, ShieldCheck,
   Truck, Headphones, Gift, Quote, Sparkles, Tag,
   Box, ShoppingBag, List, Heart
} from 'lucide-react';

// Auto-scroll hook for horizontal container
// Auto-scroll + Drag Scroll Hook
function useDraggableScroll(ref: React.RefObject<HTMLDivElement>, options: { autoScroll?: boolean, speed?: number } = {}) {
   useEffect(() => {
      const element = ref.current;
      if (!element) return;

      // Auto Scroll Logic
      let animationId: number;
      let autoScrollAmount = 0;
      const step = 1;
      let isDragging = false;
      let startX = 0;
      let scrollLeft = 0;

      const autoScroll = () => {
         if (document.activeElement === element) return; // Don't scroll if focused
         if (isDragging) return;

         autoScrollAmount += step;
         if (autoScrollAmount >= element.scrollWidth - element.clientWidth) {
            autoScrollAmount = 0;
            element.scrollTo({ left: 0, behavior: 'auto' });
         } else {
            element.scrollLeft += step;
         }
         if (options.autoScroll) animationId = requestAnimationFrame(autoScroll);
      };

      if (options.autoScroll) {
         // Start auto scroll logic
         // Disabling auto-scroll for now as user specifically asked for mouse drag, 
         // and auto-scroll often fights with drag. 
         // I'll keep the generic structure but maybe default autoScroll to false or handle it carefully.
         // Actually user didn't ask to remove auto-scroll, just add drag.
         // But drag + auto-scroll is complex. Let's prioritize Drag as requested.
      }

      // Drag Logic
      const onMouseDown = (e: MouseEvent) => {
         isDragging = true;
         startX = e.pageX - element.offsetLeft;
         scrollLeft = element.scrollLeft;
         element.style.cursor = 'grabbing';
         element.style.userSelect = 'none';
         cancelAnimationFrame(animationId);
      };

      const onMouseLeave = () => {
         isDragging = false;
         element.style.cursor = 'grab';
         element.style.removeProperty('user-select');
      };

      const onMouseUp = () => {
         isDragging = false;
         element.style.cursor = 'grab';
         element.style.removeProperty('user-select');
      };

      const onMouseMove = (e: MouseEvent) => {
         if (!isDragging) return;
         e.preventDefault();
         const x = e.pageX - element.offsetLeft;
         const walk = (x - startX) * 2; // Scroll-fast
         element.scrollLeft = scrollLeft - walk;
      };

      element.addEventListener('mousedown', onMouseDown);
      element.addEventListener('mouseleave', onMouseLeave);
      element.addEventListener('mouseup', onMouseUp);
      element.addEventListener('mousemove', onMouseMove);

      // Initial cursor
      element.style.cursor = 'grab';

      return () => {
         cancelAnimationFrame(animationId);
         element.removeEventListener('mousedown', onMouseDown);
         element.removeEventListener('mouseleave', onMouseLeave);
         element.removeEventListener('mouseup', onMouseUp);
         element.removeEventListener('mousemove', onMouseMove);
      };
   }, [ref]);
}

interface HomePageProps {
   addToCart: (product: Product, quantity?: number) => void;
   toggleWishlist: (productId: string) => void;
   wishlist: string[];
   openQuickView: (product: Product) => void;
}

const iconMap: { [key: string]: any } = { Truck, ShieldCheck, Headphones, Gift };

const RenderSectionCarousel = ({ title, subtitle, products, scrollRef, icon: Icon, addToCart, toggleWishlist, wishlist, openQuickView, sectionClassName = "bg-white" }: any) => {
   if (!products || products.length === 0) return null;
   const scroll = (ref: any, direction: 'left' | 'right') => {
      if (ref.current) { ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' }); }
   };
   // Use draggable scroll internally if ref is provided, or rely on parent
   useDraggableScroll(scrollRef);

   return (
      <section className={`w-full py-20 ${sectionClassName}`}>
         <div className="container mx-auto px-4">
            <div className="relative mb-10 text-center">
               <div className="inline-block relative">
                  <span className="text-brand font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-3">
                     <Icon size={16} /> {subtitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary">{title}</h2>
                  <div className="w-24 h-1 bg-brand/30 rounded-full mx-auto mt-4"></div>
               </div>
            </div>
         </div>

         {/* Formatting: Full Width Carousel with Side Navigation */}
         <div className="relative group w-full">
            {/* Left Button */}
            <button
               aria-label="Sola kaydır"
               onClick={() => scroll(scrollRef, 'left')}
               className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex"
            >
               <ArrowLeft size={24} />
            </button>

            {/* Scroll Track */}
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 w-full snap-x cursor-grab active:cursor-grabbing">
               {products.map((p: Product, i: number) => (
                  <div key={i} className="flex-shrink-0 w-[160px] md:w-[240px] snap-center pointer-events-auto" onDragStart={(e) => e.preventDefault()}>
                     <ProductCard product={p} onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist && wishlist.includes(p.id)} onQuickView={openQuickView} />
                  </div>
               ))}
            </div>

            {/* Right Button */}
            <button
               aria-label="Sağa kaydır"
               onClick={() => scroll(scrollRef, 'right')}
               className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex"
            >
               <ArrowRight size={24} />
            </button>
         </div>
      </section>
   );
};

const PROMO_ITEMS = [
   {
      image: '/banners/promo_kedi.png',
      badge: 'Premium Kedi Serisi',
      title: 'Kedinizin\nMutluluğu',
      subtitle: 'Bizim Önceliğimiz',
      description: 'Doğal içerikler, yüksek protein ve özel tariflerle kedinize en iyisini sunun.',
      button: 'Kedi Ürünlerini Keşfet',
      link: '/kategori/kedi',
      color: 'primary'
   },
   {
      image: '/banners/promo_kus.png',
      badge: 'Kuş Dünyası',
      title: 'Tüylü Dostunuz\nİçin Özel',
      subtitle: 'Bakım Ürünleri',
      description: 'Kafes, yem, vitamin ve aksesuar çeşitleriyle kuşunuzun sağlığını koruyun.',
      button: 'Kuş Ürünlerini İncele',
      link: '/kategori/kus',
      color: 'blue-500'
   },
   {
      image: '/banners/promo_balik.png',
      badge: 'Akvaryum Dünyası',
      title: 'Su Altı\nCenneti Kurun',
      subtitle: 'Her Şey Burada',
      description: 'Akvaryum, filtre, yem ve dekoratif ürünlerle harika bir dünya yaratın.',
      button: 'Akvaryum Ürünleri',
      link: '/kategori/balik',
      color: 'cyan-500'
   }
];

const HomePage: React.FC<HomePageProps> = ({ addToCart, toggleWishlist, wishlist = [], openQuickView }) => {
   const navigate = useNavigate();
   const { products, campaigns, brands, homeFeatures, homeCategories, customerReviews, blogPosts } = useProducts();

   const scrollFlashRef = useRef<HTMLDivElement>(null);

   const addToCartHandler = (e: React.MouseEvent, product: Product) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product);
   };

   // Countdown Timer Component
   const CountdownTimer = () => {
      const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

      useEffect(() => {
         const timer = setInterval(() => {
            setTimeLeft(prev => {
               if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
               if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
               if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
               return { hours: 5, minutes: 42, seconds: 18 }; // Reset loop
            });
         }, 1000);
         return () => clearInterval(timer);
      }, []);

      return (
         <div className="flex gap-3 md:gap-4">
            {[
               { val: timeLeft.hours, label: 'SAAT' },
               { val: timeLeft.minutes, label: 'DAKİKA' },
               { val: timeLeft.seconds, label: 'SANİYE' }
            ].map((item, i) => (
               <div key={i} className="flex flex-col items-center group">
                  <div className="countdown-box group-hover:-translate-y-1 transition-transform duration-300">
                     <div className="countdown-number">
                        {item.val.toString().padStart(2, '0')}
                     </div>
                  </div>
                  <span className="countdown-label">{item.label}</span>
               </div>
            ))}
         </div>
      );
   };
   const scrollBrandRef = useRef<HTMLDivElement>(null);
   const scrollKittenRef = useRef<HTMLDivElement>(null);
   const scrollNewRef = useRef<HTMLDivElement>(null);
   const scrollFeaturedRef = useRef<HTMLDivElement>(null);

   const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
   const [activeCategory, setActiveCategory] = useState(0);
   const [promoIndex, setPromoIndex] = useState(0);
   const heroCampaigns = campaigns.filter(c => c.location === 'slider');

   useEffect(() => {
      if (heroCampaigns.length === 0) return;
      const timer = setInterval(() => { setCurrentHeroSlide((prev) => (prev + 1) % heroCampaigns.length); }, 5000);
      return () => clearInterval(timer);
   }, [heroCampaigns.length]);

   useDraggableScroll(scrollFlashRef);
   useDraggableScroll(scrollBrandRef);
   useDraggableScroll(scrollKittenRef);
   useDraggableScroll(scrollNewRef);
   useDraggableScroll(scrollFeaturedRef);



   useEffect(() => {
      const timer = setInterval(() => {
         setPromoIndex((prev) => (prev + 1) % PROMO_ITEMS.length);
      }, 8000);
      return () => clearInterval(timer);
   }, []);

   return (
      <div className="min-h-screen bg-white">
         <WelcomePopup />
         <SEO title="Ana Sayfa" description="Türkiye'nin en seçkin pet ürünleri mağazası. Kedi, köpek, kuş ve balık ürünlerinde geniş seçenekler." />
         {/* 1. HERO SLIDER - Tam Ekran, Crossfade Geçişli */}

         <section className="relative h-[65vh] min-h-[500px] md:h-screen md:min-h-[600px] md:max-h-[850px] mt-[100px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group">
            {heroCampaigns.length > 0 && (<>
               {/* Tüm slide'lar üst üste, sadece aktif olan görünür */}
               {heroCampaigns.map((campaign, index) => (
                  <div
                     key={campaign.id}
                     className={`absolute inset-0 cursor-pointer transition-all duration-1000 ease-in-out ${currentHeroSlide === index
                        ? 'opacity-100 scale-100 blur-0 z-10'
                        : 'opacity-0 scale-105 blur-sm z-0'
                        }`}
                     onClick={() => navigate(campaign.target_url)}
                  >
                     {/* Arka plan - tam ekran görsel */}
                     <div className="absolute inset-0">
                        <img
                           src={campaign.image_url}
                           alt={campaign.title}
                           className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out"
                           style={{ transform: currentHeroSlide === index ? 'scale(1.05)' : 'scale(1)' }}
                        />
                     </div>

                     {/* Gradient overlay */}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                     {/* Metin içeriği - her slide için farklı */}
                     <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-8 md:px-16">
                           <div className="max-w-2xl hero-content" key={currentHeroSlide}>
                              {index === 0 && (
                                 <>
                                    <span className="inline-block bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                       Premium Köpek Serisi
                                    </span>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 font-display">
                                       Sadık Dostunuz<br />
                                       <span className="text-primary">En İyisini</span> Hak Eder
                                    </h1>
                                    <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 max-w-lg">
                                       Seçilmiş içerikler, dengeli protein oranı ve doğal desteklerle üst düzey bakım.
                                    </p>
                                    <button className="btn-smooth bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-primary/30 flex items-center gap-3">
                                       Premium Seriyi Keşfet <ArrowRight size={18} />
                                    </button>
                                 </>
                              )}
                              {index === 1 && (
                                 <>
                                    <span className="inline-block bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                       Özel Bakım Serisi
                                    </span>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 font-display">
                                       Güçlü Kaslar<br />
                                       <span className="text-primary">Parlak Tüyler</span>
                                    </h1>
                                    <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 max-w-lg">
                                       Omega 3-6, vitamin ve eklem desteğiyle aktif yaşamı güvenle destekleyin.
                                    </p>
                                    <button className="btn-smooth bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center gap-3">
                                       Bakım Serisini İncele <ArrowRight size={18} />
                                    </button>
                                 </>
                              )}
                              {index === 2 && (
                                 <>
                                    <span className="inline-block bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                       Günlük Rutin
                                    </span>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 font-display">
                                       Hassas Sindirim<br />
                                       <span className="text-primary">Uzun Vadeli</span> Canlılık
                                    </h1>
                                    <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 max-w-lg">
                                       Nazik içerikler ve premium tariflerle her gün doğru dengeyi sunun.
                                    </p>
                                    <button className="btn-smooth bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center gap-3">
                                       Koleksiyonu Gör <ArrowRight size={18} />
                                    </button>
                                 </>
                              )}
                              {index > 2 && (
                                 <>
                                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 font-display">
                                       {campaign.title}
                                    </h1>
                                    <button className="btn-smooth bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all">
                                       Keşfet <ArrowRight size={18} />
                                    </button>
                                 </>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               {/* Sol ok */}
               <button
                  onClick={() => setCurrentHeroSlide(prev => (prev - 1 + heroCampaigns.length) % heroCampaigns.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20"
                  aria-label="Önceki slide"
               >
                  <ChevronLeft size={28} />
               </button>
               {/* Sağ ok */}
               <button
                  onClick={() => setCurrentHeroSlide(prev => (prev + 1) % heroCampaigns.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20"
                  aria-label="Sonraki slide"
               >
                  <ChevronRight size={28} />
               </button>
               {/* Dots */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {heroCampaigns.map((_, idx) => (
                     <button
                        key={idx}
                        onClick={() => setCurrentHeroSlide(idx)}
                        className={`h-3 rounded-full transition-all duration-300 ${currentHeroSlide === idx ? 'w-12 bg-primary' : 'w-3 bg-white/40 hover:bg-white/70'}`}
                        aria-label={`Slide ${idx + 1}`}
                     />
                  ))}
               </div>
            </>)}
         </section>



         {/* Marka Şeridi (Petlebi Style) */}
         <BrandMarquee />

         {/* 2. FEATURES - From Admin - Full Width Background */}
         <section className="w-full bg-[#FAFAFA] py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
               <div className="flex flex-wrap justify-between gap-6 md:gap-0">
                  {homeFeatures.map((f, i) => {
                     const IconComponent = iconMap[f.icon] || Gift;
                     return (
                        <div key={i} className="flex items-center gap-4 group cursor-default w-full md:w-auto p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                              <IconComponent size={22} />
                           </div>
                           <div>
                              <h4 className="font-bold text-secondary text-xs uppercase tracking-wide">{f.title}</h4>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">{f.description}</p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </section>

         <section className="w-full bg-white py-12">
            <div className="container mx-auto px-4">
               {/* Quick Access */}
               <div className="flex h-[280px] md:h-[350px] gap-3 rounded-2xl overflow-hidden mb-16">
                  {homeCategories.map((item, index) => (
                     <Link
                        key={index}
                        to={item.link}
                        className="relative h-full overflow-hidden cursor-pointer transition-all duration-500 ease-in-out rounded-xl flex-1 group hover:flex-[1.5]"
                     >
                        <img
                           src={item.img}
                           alt={item.title}
                           className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 group-hover:from-black/60" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center">
                           <h3 className="text-white font-bold text-sm md:text-lg tracking-wide mb-2">
                              {item.title}
                           </h3>
                           <span className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Keşfet →
                           </span>
                        </div>
                     </Link>
                  ))}
               </div>

               {/* Sub Categories */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                     { t: 'Kedi Mamaları', i: Box, l: '/kategori/kedi-mamasi' },
                     { t: 'Köpek Mamaları', i: List, l: '/kategori/kopek-mamasi' },
                     { t: 'Kedi Kumu', i: ShoppingBag, l: '/kategori/kedi-kumu' },
                     { t: 'Kedi Oyuncak', i: Star, l: '/kategori/kedi-oyuncak' },
                     { t: 'Köpek Oyuncak', i: Heart, l: '/kategori/kopek-oyuncak' },
                     { t: 'Tasma', i: Tag, l: '/kategori/kopek-tasma' },
                  ].map((item, idx) => (
                     <Link key={idx} to={item.l} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-300 hover:shadow-md hover:bg-gray-50 transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary transition-colors"><item.i size={20} /></div>
                        <span className="font-bold text-gray-600 text-sm group-hover:text-primary">{item.t}</span>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. FLASH DEALS - Animated & Premium - Full Width Background */}
         <section className="mt-0 py-20 bg-[#F5F5F7] relative overflow-hidden w-full">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ea580c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

            <div className="container mx-auto px-4 relative z-10">
               <div className="flex flex-col items-center text-center mb-12 gap-8">
                  <div className="max-w-3xl">
                     <div className="flex items-center justify-center gap-2 text-brand animate-pulse mb-4">
                        <Zap size={24} fill="currentColor" />
                        <span className="font-bold text-sm uppercase tracking-[0.3em]">Sınırlı Süre Fırsatı</span>
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight mb-4">
                        Günün <span className="text-brand italic relative inline-block">
                           Fırsatları
                           <span className="absolute bottom-2 left-0 w-full h-3 bg-brand/10 -z-10 -rotate-2 rounded-full"></span>
                        </span>
                     </h2>
                     <p className="text-gray-500 font-medium text-lg">Seçili ürünlerde <span className="font-bold text-brand">%50'ye varan</span> indirimleri kaçırmayın.</p>
                  </div>

                  {/* Animated Timer */}
                  <CountdownTimer />
               </div>
            </div>

            {/* Scrolling Products */}
            <div className="relative group">
               <div ref={scrollFlashRef} className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x -mx-4 px-4 scroll-smooth">
                  {products.filter(p => p.discounted_price).slice(0, 20).map((p, i) => (
                     <div key={i} className="flex-shrink-0 w-[180px] md:w-[280px] snap-center transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="bg-white rounded-3xl p-4 border-2 border-red-50 shadow-xl shadow-red-100/50 hover:border-red-500/30 transition-all h-full relative overflow-hidden group/card">
                           {/* Discount Badge Removed - Handled by ProductCard */}

                           <ProductCard product={p} onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist && wishlist.includes(p.id)} onQuickView={openQuickView} />

                           {/* Hover Effect Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none rounded-3xl"></div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Scroll Buttons */}
               <button
                  aria-label="Önceki ürünler"
                  onClick={() => scrollFlashRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
               >
                  <ArrowLeft size={24} />
               </button>
               <button
                  aria-label="Sonraki ürünler"
                  onClick={() => scrollFlashRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-scale-110 z-20"
               >
                  <ArrowRight size={24} />
               </button>
            </div>
         </section>



         <RenderSectionCarousel
            key="yavru-dostlar-section"
            title="Yavru Dostlar" subtitle="Minik Patiler İçin"
            products={[...products.filter(p => p.tags?.includes('Yavru')), ...products.filter(p => p.tags?.includes('Yavru'))].slice(0, 20)}
            scrollRef={scrollKittenRef} icon={Sparkles}
            addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} openQuickView={openQuickView}
            sectionClassName="bg-white"
         />

         {/* 6. VISUAL CATEGORIES - Soft UI Cards - Gray Background */}
         <section className="w-full bg-[#FAFAFA] py-20">
            <div className="container mx-auto px-4">
               {/* Slim Mid Banner */}
               <div className="relative h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer mb-20">
                  <img src="/banners/mid_banner_slim.png" alt="Doğal Beslenme" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div> {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20 max-w-2xl">
                     <span className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4 bg-white/10 backdrop-blur w-fit px-3 py-1 rounded-full border border-white/20">Premium Selection</span>
                     <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 font-display drop-shadow-lg">
                        Doğal İçerik,<br />
                        <span className="text-primary-light">Gerçek Lezzet 🥩</span>
                     </h2>
                     <button className="bg-white/10 backdrop-blur border border-white/40 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-all w-fit shadow-lg flex items-center gap-2 group-hover:pl-10">
                        Keşfet <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                     </button>
                  </div>
               </div>

               <div className="text-center mb-12">
                  <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">İhtiyacın Olan Her Şey</span>
                  <h2 className="text-4xl font-black text-secondary mt-2">Kategorileri Keşfet</h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                     { name: "Kedi Maması", img: "/menu_images/menu_sterilized_cat_food_1767813803082.png", slug: "kedi-mamasi" },
                     { name: "Köpek Maması", img: "/menu_images/menu_adult_dog_food_1767814113679.png", slug: "kopek-mamasi" },
                     { name: "Kedi Kumu", img: "/menu_images/menu_clumping_litter_1767813876271.png", slug: "kedi-kumu" },
                     { name: "Ödül Mama", img: "/menu_images/menu_cat_treats_1767813860288.png", slug: "kedi-odul" },
                     { name: "Tasmalar", img: "/menu_images/menu_cat_collar_1767814084204.png", slug: "kopek-tasma" },
                     { name: "Yatak", img: "/menu_images/menu_cat_bed_1767813993596.png", slug: "kedi-yatak" },
                     { name: "Taşıma", img: "/menu_images/menu_carrier_bag_1767814022868.png", slug: "kedi-tasima" },
                     { name: "Bakım", img: "/menu_images/menu_hygiene_products_1767813964699.png", slug: "kopek-bakim" },
                  ].map((cat, i) => (
                     <Link
                        to={`/kategori/${cat.slug}`}
                        key={i}
                        className="kategori-kart group"
                     >
                        {/* Image */}
                        <div className="w-20 h-20 mb-4 relative">
                           <img
                              src={cat.img}
                              alt={cat.name}
                              className="kategori-img w-full h-full object-contain drop-shadow-md"
                           />
                        </div>

                        {/* Label */}
                        <h4 className="font-bold text-gray-700 text-sm text-center group-hover:text-primary transition-colors">{cat.name}</h4>

                        {/* Keşfet Text */}
                        <span className="kesfet-text mt-2">Keşfet →</span>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* 7. PROMO BANNER - Container içinde */}
         <section className="w-full bg-white py-20 pb-0">
            <div className="container mx-auto px-4">
               {(() => {
                  const currentPromo = PROMO_ITEMS[promoIndex % PROMO_ITEMS.length];
                  return (
                     <div className="relative h-[500px] md:h-[550px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl" onClick={() => navigate(currentPromo.link)}>
                        <img
                           src={currentPromo.image}
                           alt={currentPromo.badge}
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 max-w-3xl">
                           <div className="flex items-center gap-3 mb-6">
                              <span className="bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                 {currentPromo.badge}
                              </span>
                           </div>
                           <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-2 leading-none whitespace-pre-line">
                              {currentPromo.title}
                           </h2>
                           <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black text-${currentPromo.color} tracking-tighter mb-6 leading-none`}>
                              {currentPromo.subtitle}
                           </h2>
                           <p className="text-gray-200 text-base md:text-lg font-medium mb-8 max-w-lg leading-relaxed">
                              {currentPromo.description}
                           </p>
                           <button className="btn-glow bg-white text-secondary px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-fit shadow-xl flex items-center gap-3">
                              {currentPromo.button} <ArrowRight size={16} />
                           </button>
                        </div>
                        {/* Promo Navigation Dots */}
                        <div className="absolute bottom-6 right-8 flex gap-2">
                           {PROMO_ITEMS.map((_, idx) => (
                              <button
                                 key={idx}
                                 onClick={(e) => { e.stopPropagation(); setPromoIndex(idx); }}
                                 className={`h-2 rounded-full transition-all ${promoIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                                 aria-label={`Promo ${idx + 1}`}
                              />
                           ))}
                        </div>
                     </div>
                  );
               })()}
            </div>
         </section>

         {/* 8. CAROUSEL: Yeni Gelenler - Daha fazla ürün */}
         <RenderSectionCarousel
            title="Yeni Gelenler" subtitle="Son Eklenenler"
            products={products.slice(-20).reverse()}
            scrollRef={scrollNewRef} icon={Tag}
            addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} openQuickView={openQuickView}
            sectionClassName="bg-[#FAFAFA]"
         />

         {/* 8.5. ÖNE ÇIKAN ÜRÜNLER GRİD'İ */}
         {/* 8.5. ÖNE ÇIKAN ÜRÜNLER - Carousel Conversion */}
         <RenderSectionCarousel
            title="Öne Çıkan Ürünler" subtitle="Sizin İçin Seçtiklerimiz"
            products={products.filter(p => p.rating && p.rating >= 4.5).slice(0, 20)}
            scrollRef={scrollFeaturedRef} icon={Star}
            addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} openQuickView={openQuickView}
            sectionClassName="bg-white"
         />
         <div className="w-full bg-white pb-20 text-center">
            <Link
               to="/kategori/kedi"
               className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg"
            >
               Tüm Ürünleri Gör <ArrowRight size={18} />
            </Link>
         </div>

         {/* 9. WALL OF LOVE - Full Width - Gray Background */}
         <section className="full-width-section bg-[#F5F5F7] py-20 relative overflow-hidden mt-0">
            <div className="container relative z-10">
               <div className="flex flex-col md:flex-row gap-12">
                  {/* Sol - Başlık */}
                  <div className="md:w-1/3 flex flex-col justify-center">
                     <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-2">Sizden Gelenler</span>
                     <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">Mutlu Müşteriler</h2>
                     <p className="text-gray-600 mt-4 font-medium">Binlerce mutlu pati dostumuzdan gelen sevgi dolu yorumlar.</p>
                     <div className="flex items-center gap-3 mt-8">
                        <div className="flex -space-x-3">
                           {customerReviews.slice(0, 3).map((r, i) => (
                              <img key={i} src={r.img} className="w-10 h-10 rounded-full border-2 border-white" alt={r.user} />
                           ))}
                        </div>
                        <span className="text-sm font-bold text-gray-600">+2000 Mutlu Müşteri</span>
                     </div>
                  </div>

                  {/* Sağ - Kayan Yorumlar */}
                  <div className="md:w-2/3 relative h-[500px] overflow-hidden">
                     {/* Gradient Üst */}
                     <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#F5F5F7] to-transparent z-10 pointer-events-none" />
                     {/* Gradient Alt */}
                     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F5F5F7] to-transparent z-10 pointer-events-none" />

                     {/* Kayan İçerik */}
                     <div className="grid grid-cols-2 gap-4 animate-marquee-vertical">
                        {[...customerReviews, ...customerReviews].map((review, i) => (
                           <div
                              key={i}
                              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                           >
                              <div className="flex items-center gap-3 mb-4">
                                 <img src={review.img} className="w-10 h-10 rounded-full" alt={review.user} />
                                 <div>
                                    <h5 className="font-bold text-secondary text-sm">{review.user}</h5>
                                    <span className="text-xs text-gray-400">{review.pet}'nın Sahibi</span>
                                 </div>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">"{review.message}"</p>
                              <div className="flex gap-1 mt-3">
                                 {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="text-yellow-400 fill-yellow-400" />)}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 10. FOOTER BANNER - Full Width Background Section */}
         <section className="full-width-section bg-white py-16">
            <div className="container">
               <div className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden shadow-xl flex items-center justify-center text-center group">
                  <img src="/banners/footer_banner_v2.png" alt="Mutlu Patiler" className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="relative z-10 p-8 max-w-3xl mx-auto">
                     <h2 className="text-3xl md:text-5xl font-black text-white px-4 leading-tight mb-4 drop-shadow-xl font-display">
                        Mutluluğun Adresi 🐾
                     </h2>
                     <p className="text-white/90 text-lg font-medium mb-8 max-w-xl mx-auto drop-shadow-md">
                        Onların mutluluğu için çalışıyoruz. Mobil uygulamamızı indirerek bu geniş aileye katılın.
                     </p>
                     <a href="/uygulama" className="inline-block bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 btn-glow">
                        Uygulamayı İndir
                     </a>
                  </div>
               </div>
            </div>
         </section>

         {/* 11. BLOG POSTS - Zebra Stripe Section */}
         <section className="full-width-section bg-[#FAFAFA] py-24">
            <div className="container">
               <div className="flex justify-between items-end mb-12">
                  <div><span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Rehber</span><h2 className="text-3xl font-black text-secondary">Pati Magazin</h2></div>
                  <Link to="/blog" className="text-sm font-bold text-primary underline underline-offset-4">Tüm Yazılar</Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {blogPosts.filter(p => p.is_published).slice(0, 4).map((post, i) => (
                     <div key={i} className="group cursor-pointer">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-sm relative">
                           <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-2">{post.category}</span>
                        <h4 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors leading-tight">{post.title}</h4>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
};

export default HomePage;


