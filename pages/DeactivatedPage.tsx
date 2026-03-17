import React from 'react';
import { ShieldAlert, Construction, Mail, Phone } from 'lucide-react';

const DeactivatedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 relative z-10 text-center transform transition-all hover:scale-[1.01]">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-8 animate-bounce">
          <Construction className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Sitemiz Geçici Olarak <span className="text-primary italic">Servis Dışı</span>
        </h1>

        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Değerli müşterilerimiz, size daha iyi hizmet verebilmek adına sitemizde teknik güncellemeler yapıyoruz. 
          Çok yakında yepyeni sürprizlerle tekrar yayında olacağız.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 group-hover:bg-primary group-hover:text-white transition-all">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">E-posta</p>
              <p className="text-gray-900 font-medium">info@petshop.com</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 group-hover:bg-primary group-hover:text-white transition-all">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Telefon</p>
              <p className="text-gray-900 font-medium">0850 000 00 00</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
          <p className="text-sm text-gray-400 mb-4 italic">Anlayışınız için teşekkür ederiz.</p>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivatedPage;
