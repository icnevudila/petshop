
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone, MapPin, Loader2, Cat, Dog, Bird, ArrowRight, Info, BookOpen, Waves, Rabbit } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import { NAV_DATA } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../ProductContext';
import { Product } from '../types';

interface HeaderProps {
   cartCount: number;
   wishlistCount: number;
}

const PatiDukkanLogo = () => (
   <img
      src="/logopng.png"
      alt="PatiDükkan"
      className="h-64 md:h-80 w-auto drop-shadow-lg transition-all hover:scale-110 hover:drop-shadow-2xl absolute left-0 top-1/2 -translate-y-1/2 animate-pulse-slow"
   />
);

const placeholders = [
   "Kedi maması...",
   "Köpek oyuncağı...",
   "Kuş yemi...",
   "Akvaryum filtresi...",
   "Tasma ve kayış..."
];

const Header: React.FC<HeaderProps> = ({ cartCount, wishlistCount }) => {
   const navigate = useNavigate();
   const searchRef = useRef<HTMLDivElement>(null);
   const { currentUser, logout } = useAuth();
   const { products, siteSettings } = useProducts();
   const [isScrolled, setIsScrolled] = useState(false);
   const [activeMenu, setActiveMenu] = useState<string | null>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [searchResults, setSearchResults] = useState<Product[]>([]);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [displayText, setDisplayText] = useState('');
   const [isDeleting, setIsDeleting] = useState(false);
   const [loopNum, setLoopNum] = useState(0);
   const [typingSpeed, setTypingSpeed] = useState(300);

   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.length > 1) {
         const lowerQ = query.toLowerCase();
         // Safely filter products, checking if name exists
         const filtered = (products || []).filter(p => p && p.name && p.name.toLowerCase().includes(lowerQ)).slice(0, 4);
         setSearchResults(filtered);
      } else {
         setSearchResults([]);
      }
   };

   useEffect(() => {
      const handleTyping = () => {
         const i = loopNum % placeholders.length;
         const fullText = placeholders[i];

         setDisplayText(isDeleting
            ? fullText.substring(0, displayText.length - 1)
            : fullText.substring(0, displayText.length + 1)
         );

         setTypingSpeed(isDeleting ? 30 : 150);

         if (!isDeleting && displayText === fullText) {
            setTimeout(() => setIsDeleting(true), 1000);
         } else if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
         }
      };

      const timer = setTimeout(handleTyping, typingSpeed);
      return () => clearTimeout(timer);
   }, [displayText, isDeleting, loopNum, typingSpeed]);

   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);

      const handleClickOutside = (event: MouseEvent) => {
         if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setSearchResults([]);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         window.removeEventListener('scroll', handleScroll);
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   const handleNavClick = (slug: string) => {
      setActiveMenu(null);
      setIsMobileMenuOpen(false);
      navigate(`/kategori/${slug}`);
   };

   const [isCartAnimating, setIsCartAnimating] = useState(false);

   useEffect(() => {
      if (cartCount > 0) {
         setIsCartAnimating(true);
         const timer = setTimeout(() => setIsCartAnimating(false), 500); // 500ms match animation duration
         return () => clearTimeout(timer);
      }
   }, [cartCount]);

   return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
         {/* Top Announcement Bar */}
         <AnnouncementBar />

         {/* Top Bar - Removed for compact header */}

         {/* Main Header - Compact with box-shadow */}
         <div className={`w-full transition-all duration-300 relative z-[1001] bg-white ${isScrolled ? 'shadow-[0_1px_0_0_rgba(0,0,0,0.05)]' : 'shadow-[0_1px_0_0_rgba(0,0,0,0.05)]'}`}>
            <div className="container flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 py-3 lg:py-2">

               {/* Logo */}
               <div className="flex items-center gap-4">
                  {/* Hamburger Menu Button - Mobile Only */}
                  <button
                     onClick={() => setIsMobileMenuOpen(true)}
                     className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand hover:bg-brand/5 transition-all"
                     aria-label="Menü"
                  >
                     <Menu size={24} />
                  </button>

                  <Link to="/" className="relative w-40 md:w-80 h-8 hover:opacity-80 transition-opacity">
                     <PatiDukkanLogo />
                  </Link>
               </div>

               {/* Search Bar - Full Width on Mobile */}
               <div className="order-last lg:order-none w-full lg:w-auto lg:flex-grow max-w-[500px] relative block" ref={searchRef}>
                  <div className="relative group">
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={displayText}
                        className="w-full bg-[#f4f4f4] hover:bg-[#ebebeb] focus:bg-white border border-gray-200 focus:border-brand/40 rounded-full pl-11 pr-20 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-gray-400 text-secondary"
                     />
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
                     <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary-hover transition-colors">
                        ARA
                     </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 z-[1100]">
                        {searchResults.map(p => (
                           <Link
                              key={p.id}
                              to={`/urun/${p.slug}`}
                              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                           >
                              <img src={p.images[0]} className="w-12 h-12 object-contain mix-blend-multiply border border-gray-100 rounded-lg bg-white" alt={p.name} />
                              <div>
                                 <p className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors line-clamp-1">{p.name}</p>
                                 <p className="text-[11px] text-gray-500 font-medium">{p.brand_name}</p>
                              </div>
                              <div className="ml-auto text-sm font-black text-brand">
                                 {(p.discounted_price || p.price).toLocaleString('tr-TR')} ₺
                              </div>
                           </Link>
                        ))}
                     </div>
                  )}
               </div>

               {/* User Actions - Hidden on Mobile (Moved to Bottom Nav) */}
               <div className="hidden lg:flex items-center gap-1 md:gap-2">
                  {/* Dynamic User Menu */}
                  {currentUser ? (
                     <div className="hidden md:flex flex-col items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand hover:bg-brand/5 transition-all cursor-pointer group relative">
                        {currentUser.photoURL ? (
                           <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="w-6 h-6 rounded-full" />
                        ) : (
                           <User size={18} />
                        )}
                        <span className="text-[9px] font-bold line-clamp-1 max-w-[50px]">{currentUser.displayName?.split(' ')[0] || 'Hesabım'}</span>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-[1200]">
                           <div className="px-4 py-2 border-b border-gray-50 mb-2">
                              <p className="text-xs text-gray-400 font-bold">Hoşgeldin,</p>
                              <p className="text-sm font-bold text-secondary truncate">{currentUser.displayName || currentUser.email}</p>
                           </div>
                           <Link to="/hesabim" className="block px-4 py-2text-sm font-medium text-gray-600 hover:text-brand hover:bg-gray-50 rounded-lg transition-colors">Hesabım</Link>
                           <Link to="/admin" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand hover:bg-gray-50 rounded-lg transition-colors">Admin Paneli</Link>
                           <button
                              onClick={() => logout()}
                              className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                           >
                              Çıkış Yap
                           </button>
                        </div>
                     </div>
                  ) : (
                     <Link to="/giris" className="hidden md:flex flex-col items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand hover:bg-brand/5 transition-all" aria-label="Giriş Yap">
                        <User size={18} />
                        <span className="text-[9px] font-bold">Giriş</span>
                     </Link>
                  )}

                  <Link to="/favoriler" className="relative flex flex-col items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand hover:bg-brand/5 transition-all">
                     <Heart size={18} />
                     <span className="text-[9px] font-bold">Favori</span>
                     {wishlistCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full ring-1 ring-white"></span>}
                  </Link>

                  <Link to="/sepet" className={`flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-hover transition-all ${isCartAnimating ? 'animate-shake' : ''}`}>
                     <ShoppingCart size={16} />
                     <span className="text-[11px] font-bold">Sepetim ({cartCount})</span>
                  </Link>
               </div>
            </div>
         </div>

         {/* Navigation Menu */}
         <div className="hidden lg:block border-b border-gray-100 bg-white relative z-[1002]">
            <div className="container flex justify-start items-center">
               {/* Left: Category Mega Menus - aligned with logo */}
               <div className="flex gap-0">
                  {NAV_DATA.map((nav, index) => (
                     <div key={nav.id} className="group" onMouseEnter={() => setActiveMenu(nav.id)} onMouseLeave={() => setActiveMenu(null)}>
                        <Link
                           to={`/kategori/${nav.slug}`}
                           className={`flex items-center gap-2 py-3 px-3 text-[14px] font-bold tracking-wide uppercase transition-all border-b-2 border-transparent relative z-[1002] whitespace-nowrap ${index === 0 ? 'pl-0' : ''} ${activeMenu === nav.id ? 'text-primary border-primary' : 'text-secondary hover:text-primary'}`}
                        >
                           {nav.id === 'kedi' && <Cat size={18} />}
                           {nav.id === 'kopek' && <Dog size={18} />}
                           {nav.id === 'kus' && <Bird size={18} />}
                           {nav.id === 'balik' && <Waves size={18} />}
                           {nav.id === 'kemirgen' && <Rabbit size={18} />}
                           {nav.name}
                           <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === nav.id ? 'rotate-180' : ''}`} />
                        </Link>

                        {/* Dropdown Content */}
                        <div
                           className={`absolute left-1/2 -translate-x-1/2 top-full w-screen bg-white shadow-menu border-t border-gray-100 transition-all duration-300 origin-top z-[1001] pt-2 ${activeMenu === nav.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4 pointer-events-none'}`}
                           onMouseEnter={() => setActiveMenu(nav.id)}
                           onMouseLeave={() => setActiveMenu(null)}
                        >
                           <div className="absolute top-0 left-0 w-full h-2 -mt-2 bg-transparent"></div> {/* Bridge for mouse hover */}
                           <div className="container mx-auto px-4 py-8">
                              <div className="grid grid-cols-12 gap-12">
                                 <div className="col-span-9 grid grid-cols-3 gap-12">
                                    {nav.items.map((item, idx) => (
                                       <div key={idx} className="space-y-4">
                                          <div onClick={() => handleNavClick(nav.slug)} className="flex items-center gap-3 border-b-2 border-gray-50 pb-2 cursor-pointer group/title">
                                             <h4 className="text-sm font-black text-secondary uppercase tracking-wider group-hover/title:text-brand transition-colors">{item.name}</h4>
                                             <ArrowRight size={14} className="text-brand opacity-0 group-hover/title:opacity-100 -translate-x-2 group-hover/title:translate-x-0 transition-all" />
                                          </div>
                                          <ul className="space-y-3">
                                             {item.sub.map((s: any, i: number) => (
                                                <li key={i}>
                                                   <Link
                                                      to={`/kategori/${item.slug}`}
                                                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand/5 transition-all group/link"
                                                      onClick={() => setActiveMenu(null)}
                                                   >
                                                      <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 group-hover/link:border-brand/20 overflow-hidden">
                                                         {s.image ? <img src={s.image} className="w-full h-full object-cover rounded" alt={s.name} /> : <div className="w-full h-full bg-gray-100" />}
                                                      </div>
                                                      <span className="text-xs font-bold text-gray-600 group-hover/link:text-secondary group-hover/link:translate-x-1 transition-all">{s.name}</span>
                                                   </Link>
                                                </li>
                                             ))}
                                          </ul>
                                       </div>
                                    ))}
                                 </div>
                                 <div className="col-span-3">
                                    <div className="bg-white rounded-3xl p-6 h-full border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all flex flex-col items-center text-center cursor-pointer group/ad" onClick={() => handleNavClick(nav.slug)}>
                                       <div className="w-full aspect-square relative mb-6 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                          <img
                                             src={
                                                nav.slug === 'kedi' ? '/banners/mega_kedi.png' :
                                                   nav.slug === 'kopek' ? '/banners/mega_kopek.png' :
                                                      nav.slug === 'kus' ? '/banners/mega_kus.png' :
                                                         nav.slug === 'balik' ? '/banners/mega_balik.png' :
                                                            nav.slug === 'kemirgen' ? '/banners/mega_kemirgen.png' :
                                                               '/banners/mega_kedi.png'
                                             }
                                             className="w-full h-full object-contain p-4 group-hover/ad:scale-110 transition-transform duration-500"
                                             alt={nav.name}
                                          />
                                       </div>
                                       <div className="relative z-10 w-full">
                                          <span className="inline-block bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm shadow-primary/20">
                                             {nav.slug === 'kedi' ? 'Kedi Dünyası' :
                                                nav.slug === 'kopek' ? 'Köpek Dostu' :
                                                   nav.slug === 'kus' ? 'Kuş Severler' :
                                                      nav.slug === 'balik' ? 'Su Altı' :
                                                         'Küçük Dostlar'}
                                          </span>
                                          <h3 className="text-xl font-black text-secondary leading-tight mb-4">
                                             {nav.slug === 'kedi' ? <>Minik Dostunuz İçin<br />En Lezzetli Mamalar</> :
                                                nav.slug === 'kopek' ? <>Sadık Dostunuz İçin<br />Eğlenceli Oyuncaklar</> :
                                                   nav.slug === 'kus' ? <>Renkli Dostlarınız İçin<br />Konforlu Kafesler</> :
                                                      nav.slug === 'balik' ? <>Akvaryumunuz İçin<br />Canlı Bitkiler</> :
                                                         <>Kemirgenler İçin<br />Özel Yemler</>}
                                          </h3>
                                          <button className="w-full bg-white text-primary border-2 border-primary/10 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white transition-all">Hemen Keşfet</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Right: Extra Links */}
               <div className="flex items-center gap-1">
                  <Link to="/hakkimizda" className="flex items-center gap-2 py-4 px-4 text-sm font-bold text-gray-600 hover:text-brand transition-all">
                     <Info size={16} /> Hakkımızda
                  </Link>
                  <Link to="/blog" className="flex items-center gap-2 py-4 px-4 text-sm font-bold text-gray-600 hover:text-brand transition-all">
                     <BookOpen size={16} /> Blog
                  </Link>
                  <Link to="/iletisim" className="flex items-center gap-2 py-4 px-4 text-sm font-bold text-gray-600 hover:text-brand transition-all">
                     <Phone size={16} /> İletişim
                  </Link>
               </div>
            </div>
         </div>

         {/* Mobile Menu Drawer */}
         <div className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
               <div className="p-6 flex justify-between items-center bg-[#fcfcfc] border-b border-gray-100">
                  <span className="text-xl font-black text-secondary uppercase tracking-tight">Menü</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Kapat"><X size={24} className="text-gray-400" /></button>
               </div>
               <div className="p-6 overflow-y-auto h-full pb-32 space-y-8">
                  {NAV_DATA.map(nav => (
                     <div key={nav.id} className="border-b border-gray-50 pb-6 last:border-0">
                        <h4 className="text-base font-black text-brand mb-4 flex items-center gap-2 uppercase tracking-wide">
                           {nav.id === 'kedi' ? <Cat size={18} /> : nav.id === 'kopek' ? <Dog size={18} /> : <Bird size={18} />}
                           {nav.name}
                        </h4>
                        <div className="space-y-4 pl-4 border-l-2 border-brand/10">
                           {nav.items.map((item, idx) => (
                              <div key={idx}>
                                 <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">{item.name}</h5>
                                 <div className="grid gap-2">
                                    {item.sub.map((s: any, i: number) => (
                                       <button key={i} onClick={() => handleNavClick(item.slug)} className="flex items-center gap-3 text-left py-2 group">
                                          <img src={s.image} className="w-8 h-8 rounded-lg object-cover bg-gray-50" alt={s.name} />
                                          <span className="text-sm font-medium text-gray-700 group-hover:text-brand">{s.name}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}

                  {/* Extra Links in Mobile */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                     <Link to="/hakkimizda" className="flex items-center gap-3 text-sm font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                        <Info size={18} /> Hakkımızda
                     </Link>
                     <Link to="/blog" className="flex items-center gap-3 text-sm font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                        <BookOpen size={18} /> Blog
                     </Link>
                     <Link to="/iletisim" className="flex items-center gap-3 text-sm font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                        <Phone size={18} /> İletişim
                     </Link>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl mt-4">
                     <Link to="/sepet" className="flex items-center gap-3 text-sm font-bold text-gray-700 mb-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCart size={18} /> Sepetim
                     </Link>
                     <Link to="/favoriler" className="flex items-center gap-3 text-sm font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                        <Heart size={18} /> Favorilerim
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </header >
   );
};

export default Header;
