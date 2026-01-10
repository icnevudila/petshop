import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, ShieldCheck, Truck, Award, Users, Star, ArrowRight, Tag, Cat, Dog, Bird, Fish } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] to-white pt-[120px] pb-20">
            <SEO
                title="Hakkımızda"
                description="PatiDükkan'ın kuruluş hikayesi, misyonu ve vizyonu. Türkiye'nin en sevilen pet shop markası olma yolculuğumuz."
                image="/banners/about_hero_new.png"
            />

            <div className="container mx-auto px-4">
                {/* Hero Section - Pet Focused */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-orange-100 text-primary text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4">
                            Hakkımızda
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-secondary leading-tight mb-6">
                            Patili Dostlarınızın
                            <br />
                            <span className="text-primary">Mutluluğu İçin</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            2020'de küçük bir hayalle başladık. Bugün, binlerce mutlu kuyruğun sallanma sebebi olmanın gururunu yaşıyoruz.
                        </p>
                    </div>

                    {/* Hero Image - Pet Collage */}
                    <div className="relative max-w-4xl mx-auto">
                        <div className="rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="/banners/about_hero_new.png"
                                alt="Mutlu Patiler Ailesi"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <div className="text-4xl font-black text-primary">50K+</div>
                            <div className="text-sm font-bold text-gray-500">Mutlu Müşteri</div>
                        </div>
                        <div className="absolute -bottom-8 right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <div className="text-4xl font-black text-primary">100K+</div>
                            <div className="text-sm font-bold text-gray-500">Mutlu Pati</div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Cards - Pet Themed */}
                <section className="mb-20 mt-24">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Mission Card with Cat */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/banners/about_mission.png"
                                    alt="Misyonumuz"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                                    <Heart className="text-primary" size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-secondary mb-4">Misyonumuz</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Evcil hayvan sahiplerine en kaliteli ürünleri, en erişilebilir fiyatlarla sunmak.
                                    Her paketimizde sadece mama değil, sevgi ve özen taşıyoruz.
                                </p>
                            </div>
                        </div>

                        {/* Vision Card with Dog */}
                        <div className="bg-gradient-to-br from-secondary to-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow text-white">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/banners/about_vision.png"
                                    alt="Vizyonumuz"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                                    <Star className="text-white" size={28} />
                                </div>
                                <h2 className="text-3xl font-black mb-4">Vizyonumuz</h2>
                                <p className="text-white/90 leading-relaxed">
                                    Global standartlarda hizmet veren, teknolojiyi en iyi kullanan ve hayvan hakları konusunda öncü,
                                    Türkiye'nin lider pet platformu olmak.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values - Pet Icons */}
                <section className="mb-20">
                    <div className="text-center mb-16">
                        <span className="text-primary font-black text-sm uppercase tracking-widest">Değerlerimiz</span>
                        <h2 className="text-4xl font-black text-secondary mt-4">Bizi Biz Yapanlar</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: "Kalite", desc: "Sadece kendi dostlarımıza yedireceğimiz ürünleri satıyoruz.", icon: Shield, color: "bg-blue-100 text-blue-600" },
                            { title: "Güven", desc: "%100 orijinal ürün garantisi ve güvenli alışveriş altyapısı.", icon: ShieldCheck, color: "bg-green-100 text-green-600" },
                            { title: "Sevgi", desc: "İşimizin merkezinde patili dostlarımıza duyduğumuz sevgi var.", icon: Heart, color: "bg-red-100 text-red-600" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
                                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                                    <item.icon size={36} />
                                </div>
                                <h3 className="text-2xl font-black text-secondary mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pet Categories Showcase */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-secondary mb-4">Tüm Dostlarınız İçin</h2>
                        <p className="text-gray-600 text-lg">Her türden evcil hayvan için özel ürünler</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { name: "Kediler", icon: Cat, color: "from-orange-400 to-red-500", link: "/kategori/kedi" },
                            { name: "Köpekler", icon: Dog, color: "from-blue-400 to-indigo-500", link: "/kategori/kopek" },
                            { name: "Kuşlar", icon: Bird, color: "from-green-400 to-emerald-500", link: "/kategori/kus" },
                            { name: "Balıklar", icon: Fish, color: "from-cyan-400 to-blue-500", link: "/kategori/balik" }
                        ].map((pet, i) => (
                            <Link
                                key={i}
                                to={pet.link}
                                className={`bg-gradient-to-br ${pet.color} rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform shadow-lg group`}
                            >
                                <pet.icon size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-black">{pet.name}</h3>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-br from-secondary to-gray-800 rounded-3xl p-12 md:p-20 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Ailenizin Parçası Olmaya <span className="text-primary">Hazırız</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Bize katılın, fırsatları ve sevgiyi paylaşalım.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-black text-lg hover:bg-orange-600 transition-all shadow-2xl hover:scale-105"
                    >
                        Hemen Keşfet <ArrowRight size={24} />
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
