import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, ShieldCheck, Truck, Award, Users, Star, ArrowRight, Tag } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-[120px] pb-0 overflow-hidden">
            <SEO
                title="Hakkımızda"
                description="PatiDükkan'ın kuruluş hikayesi, misyonu ve vizyonu. Türkiye'nin en sevilen pet shop markası olma yolculuğumuz."
                image="/banners/about_hero.png"
            />

            {/* 1. HERO SECTION - Asymmetrical & Organic */}
            <section className="container mx-auto px-4 mb-32 relative">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="lg:w-5/12 relative z-10 text-center lg:text-left">
                        <span className="inline-block bg-orange-100 text-primary text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6">
                            Hikayemiz
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-secondary leading-none mb-8 font-display">
                            Patili Dostlarınız İçin <br />
                            <span className="text-primary relative inline-block">
                                En İyisi
                                <svg className="absolute w-full h-4 -bottom-2 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium">
                            2020'de küçük bir hayalle başladık. Bugün, binlerce mutlu kuyruğun sallanma sebebi olmanın gururunu yaşıyoruz.
                        </p>
                        <div className="flex justify-center lg:justify-start gap-4">
                            <Link to="/kategori/kedi" className="btn-glow bg-primary text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-primary/30 hover:bg-orange-600 transition-all flex items-center gap-3">
                                Alışverişe Başla <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-7/12 relative">
                        {/* Organic Blob Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#ffe4d9] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-float -z-10 blur-3xl opacity-60"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-white rounded-[60%_40%_30%_70%/60%_30%_70%_40%] shadow-xl shadow-orange-100/50 -z-0"></div>

                        <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="/banners/about_hero.png"
                                className="w-full h-auto drop-shadow-2xl rounded-[3rem] mask-image-blob clip-path-polygon-about"
                                alt="Mutlu pati ekibi"
                            />
                        </div>

                        {/* Floating Stats Bubbles */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-lg animate-pulse-soft hidden md:block">
                            <div className="text-3xl font-black text-primary">50K+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mutlu Müşteri</div>
                        </div>
                        <div className="absolute -top-10 -right-5 bg-white p-5 rounded-[2rem] shadow-lg animate-float hidden md:block delay-1000">
                            <Heart className="text-red-500 fill-red-500 w-8 h-8" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MISSION & VISION - Overlapping Cards */}
            <section className="container mx-auto px-4 mb-40">
                <div className="relative max-w-5xl mx-auto">
                    {/* Mission Card */}
                    <div className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-xl relative z-10 lg:w-3/4 lg:mr-auto hover:transform hover:-translate-y-2 transition-transform duration-500 border border-gray-50">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 text-primary">
                            <Award size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-secondary mb-6">Misyonumuz</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Evcil hayvan sahiplerine en kaliteli ürünleri, en erişilebilir fiyatlarla ve en güvenilir hizmetle sunmak.
                            Her paketimizde sadece mama değil, sevgi ve özen taşıyoruz.
                        </p>
                    </div>

                    {/* Vision Card - Overlapping */}
                    <div className="bg-secondary text-white rounded-[3rem] p-12 lg:p-16 shadow-2xl lg:absolute lg:top-24 lg:right-0 lg:w-3/5 z-20 mt-[-40px] lg:mt-0 hover:transform hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Star size={180} />
                        </div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-8 text-white">
                            <Star size={32} />
                        </div>
                        <h2 className="text-4xl font-black mb-6">Vizyonumuz</h2>
                        <p className="text-white/80 leading-relaxed text-lg">
                            Global standartlarda hizmet veren, teknolojiyi en iyi kullanan ve hayvan hakları konusunda öncü,
                            Türkiye'nin lider pet platformu olmak.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. VALUES - Zig Zag Layout */}
            <section className="bg-white py-32 skew-y-3 relative z-0">
                <div className="container mx-auto px-4 -skew-y-3">
                    <div className="text-center mb-24">
                        <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">Değerlerimiz</span>
                        <h2 className="text-5xl font-black text-secondary mt-4">Bizi Biz Yapanlar</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Kalite", desc: "Sadece kendi dostlarımıza yedireceğimiz ürünleri satıyoruz.", icon: Shield },
                            { title: "Güven", desc: "%100 orijinal ürün garantisi ve güvenli alışveriş altyapısı.", icon: ShieldCheck },
                            { title: "Sevgi", desc: "İşimizin merkezinde patili dostlarımıza duyduğumuz sevgi var.", icon: Heart }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-primary/30">
                                    <item.icon size={40} className="text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary mb-4">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. ORGANIC CTA */}
            <section className="container mx-auto px-4 py-32 mb-10">
                <div className="relative rounded-[4rem] overflow-hidden bg-gradient-to-br from-[#2D3436] to-[#1a1f20] p-12 md:p-32 text-center">
                    {/* Splash Shape Background */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path fill="#FF7A30" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.8C93.4,7.6,81.8,19.5,70.5,30.3C59.2,41.2,48.2,51,36.2,57.8C24.2,64.7,11.2,68.6,-1.3,70.9C-13.8,73.1,-27,73.8,-39.2,68.1C-51.4,62.4,-62.7,50.4,-70.6,36.7C-78.5,23,-83.1,7.6,-80.6,-6.4C-78.1,-20.5,-68.5,-33.1,-57.4,-42.6C-46.3,-52.1,-33.7,-58.5,-20.8,-66.5C-7.9,-74.4,5.3,-84,18.9,-85C32.4,-86,46.5,-78.4,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-white max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-display">
                            Ailenizin Parçası Olmaya <br /> <span className="text-primary">Hazırız</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 font-medium">Bize katılın, fırsatları ve sevgiyi paylaşalım.</p>
                        <Link to="/" className="inline-flex items-center gap-3 bg-white text-secondary px-12 py-6 rounded-full font-black text-lg hover:bg-primary hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95">
                            Hemen Keşfet <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;
