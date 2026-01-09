
import React from 'react';
import { Phone, MapPin, Truck, Gift, Headphones, Package, Mail, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <>
      {/* Üst Feature Bar */}
      <section className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Hızlı Kargo", sub: "24 saatte kargoda" },
              { icon: Package, title: "Güvenli Ödeme", sub: "256-bit SSL koruma" },
              { icon: Headphones, title: "Canlı Destek", sub: "Hergün 09:00 - 24:00" },
              { icon: Gift, title: "Sürpriz Hediyeler", sub: "Her siparişte sürpriz" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 group justify-center text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <item.icon size={24} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-secondary font-bold text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ana Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16 text-center">

            <div className="lg:col-span-3 space-y-6 flex flex-col items-center lg:items-start lg:text-left">
              <img src="/logopng.png" alt="Pati Dükkan" className="h-40 w-auto object-contain mx-auto lg:mx-0" />
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium mx-auto lg:mx-0">
                PatiDükkan olarak, minik dostlarınızın sağlığı ve mutluluğu için en kaliteli ürünleri sunuyoruz.
              </p>

              {/* İletişim Bilgileri */}
              <div className="space-y-4 pt-2 w-full flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 text-secondary justify-center lg:justify-start text-left">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-bold leading-relaxed">
                    Ertuğrulgazi mahallesi Kozluca Bulvarı<br /> No:29 (Şımarık AVM yanı)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary justify-center lg:justify-start">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-bold">+90 (555) 123 45 67</span>
                </div>
              </div>
            </div>

            {/* Kolay Menü */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-2 inline-block">Kolay Menü</h4>
              <ul className="space-y-3 text-sm text-gray-500 w-full">
                <li><Link to="/kategori/kedi" className="hover:text-primary transition-colors block py-1">Kedi</Link></li>
                <li><Link to="/kategori/kopek" className="hover:text-primary transition-colors block py-1">Köpek</Link></li>
                <li><Link to="/kategori/kus" className="hover:text-primary transition-colors block py-1">Kuş</Link></li>
                <li><Link to="/kategori/balik" className="hover:text-primary transition-colors block py-1">Balık</Link></li>
                <li><Link to="/kategori/kemirgen" className="hover:text-primary transition-colors block py-1">Kemirgen</Link></li>
              </ul>
            </div>

            {/* Hesabım */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-2 inline-block">Hesabım</h4>
              <ul className="space-y-3 text-sm text-gray-500 w-full">
                <li><Link to="/hesabim" className="hover:text-primary transition-colors block py-1">Hesabım</Link></li>
                <li><Link to="/hesabim" className="hover:text-primary transition-colors block py-1">Siparişlerim</Link></li>
                <li><Link to="/favoriler" className="hover:text-primary transition-colors block py-1">İstek Listesi</Link></li>
                <li><Link to="/sepet" className="hover:text-primary transition-colors block py-1">Sipariş Takibi</Link></li>
                <li><Link to="/sepet" className="hover:text-primary transition-colors block py-1">Sepet</Link></li>
              </ul>
            </div>

            {/* Şirketimiz */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-2 inline-block">Şirketimiz</h4>
              <ul className="space-y-3 text-sm text-gray-500 w-full">
                <li><Link to="/hakkimizda" className="hover:text-primary transition-colors block py-1">Hakkımızda</Link></li>
                <li><Link to="/iletisim" className="hover:text-primary transition-colors block py-1">İletişim</Link></li>
                <li><Link to="/hakkimizda" className="hover:text-primary transition-colors block py-1">Gizlilik Politikası</Link></li>
                <li><Link to="/hakkimizda" className="hover:text-primary transition-colors block py-1">İade Politikası</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors block py-1">Sık Sorulan Sorular</Link></li>
              </ul>
            </div>

            {/* Google Maps Embed - Moved to Right Column */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-2 inline-block text-center lg:text-right">Mağazamıza Gelin</h4>
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.0!2d29.0!3d40.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDYnNTkuMSJOIDI5wrA1NSc1OS4xIkU!5e0!3m2!1str!2str!4v1635780000000!5m2!1str!2str"
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
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-50"
      >
        ↑
      </button>
    </>
  );
};

export default Footer;
