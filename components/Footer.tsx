
import React from 'react';
import { Phone, MapPin, Truck, Gift, Headphones, Package, Mail, Instagram, Facebook, Twitter, Youtube, Cat } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <>
      {/* Üst Feature Bar - Kompakt 2x2 Grid on Mobile */}
      <section className="bg-gray-50 py-6 md:py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Truck, title: "Hızlı Kargo", sub: "24 saatte kargoda" },
              { icon: Package, title: "Güvenli Ödeme", sub: "256-bit SSL" },
              { icon: Headphones, title: "Canlı Destek", sub: "09:00 - 24:00" },
              { icon: Gift, title: "Hediyeler", sub: "Her siparişte" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-secondary font-bold text-xs truncate">{item.title}</h4>
                  <p className="text-gray-400 text-[10px] truncate">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ana Footer - Mobilde Gizli (Sadece Copyright Kalacak) */}
      <footer className="hidden lg:block bg-white pt-8 md:pt-16 pb-6 md:pb-8 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100"></div>

        <div className="container mx-auto px-4">
          {/* Logo ve İletişim - Mobilde Gizli */}
          <div className="hidden md:block mb-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="relative group hover-tail-wag cursor-pointer">
                <img src="/logopng.png" alt="Pati Dükkan" className="h-32 w-auto object-contain" />
              </div>
              <div className="space-y-3 text-center lg:text-left">
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                  Minik dostlarınızın sağlığı ve mutluluğu için en kaliteli ürünler.
                </p>
                <div className="flex items-center gap-3 text-secondary justify-center lg:justify-start">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-medium">Ertuğrulgazi mah. Kozluca Bulvarı No:29</span>
                </div>
                <div className="flex items-center gap-3 text-secondary justify-center lg:justify-start">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-bold">+90 (555) 123 45 67</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobil: 3 Sütun, Desktop: 4 Sütun Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mb-8">
            {/* Kolay Menü */}
            <div>
              <h4 className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-wider mb-3 md:mb-4">Kategoriler</h4>
              <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-sm text-gray-500">
                <li><Link to="/kategori/kedi" className="hover:text-primary">Kedi</Link></li>
                <li><Link to="/kategori/kopek" className="hover:text-primary">Köpek</Link></li>
                <li><Link to="/kategori/kus" className="hover:text-primary">Kuş</Link></li>
                <li><Link to="/kategori/balik" className="hover:text-primary">Balık</Link></li>
                <li className="hidden md:block"><Link to="/kategori/kemirgen" className="hover:text-primary">Kemirgen</Link></li>
              </ul>
            </div>

            {/* Hesabım */}
            <div>
              <h4 className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-wider mb-3 md:mb-4">Hesabım</h4>
              <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-sm text-gray-500">
                <li><Link to="/hesabim" className="hover:text-primary">Hesabım</Link></li>
                <li><Link to="/sepet" className="hover:text-primary">Sepetim</Link></li>
                <li><Link to="/favoriler" className="hover:text-primary">Favoriler</Link></li>
                <li><Link to="/siparis-takibi" className="hover:text-primary">Takip</Link></li>
              </ul>
            </div>

            {/* Şirketimiz */}
            <div>
              <h4 className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-wider mb-3 md:mb-4">Bilgi</h4>
              <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-sm text-gray-500">
                <li><Link to="/hakkimizda" className="hover:text-primary">Hakkımızda</Link></li>
                <li><Link to="/iletisim" className="hover:text-primary">İletişim</Link></li>
                <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link to="/sss" className="hover:text-primary">SSS</Link></li>
              </ul>
            </div>

            {/* Google Maps - Visible on all devices, centered on mobile */}
            <div className="col-span-3 md:col-span-1 text-center md:text-left">
              <h4 className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-wider mb-3 md:mb-4">Mağazamız</h4>
              <div className="w-full max-w-sm mx-auto md:max-w-none md:mx-0 h-24 md:h-32 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <iframe
                  src="https://maps.google.com/maps?q=Ertu%C4%9Frulgazi%20mahallesi%20Kozluca%20Bulvar%C4%B1%20No:29%20%C4%B0neg%C3%B6l%20Bursa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mağaza Konumu"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-400">
              © 2025 Pati Dükkanı. Tüm Hakları Saklıdır
            </p>
            <div className="flex gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-4 w-10 h-10 bg-primary hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40 lg:bottom-6 lg:right-6 lg:w-12 lg:h-12"
      >
        ↑
      </button>
    </>
  );
};

export default Footer;
