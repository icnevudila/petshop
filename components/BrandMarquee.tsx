
import React from 'react';

// Kopyalanan marka logo yolları
const BRAND_LOGOS = [
    '/markalar/brit.png',
    '/markalar/felicia.png',
    '/markalar/ever-clean.webp',
    '/markalar/exclusion.png',
    '/markalar/wanpy.png',
    '/markalar/royal-canin-210.jpg',
    '/markalar/Group_135141.webp',
    '/markalar/Group_135148.webp',
    '/markalar/Group_135149.webp',
    '/markalar/Group_135152.webp',
    '/markalar/Group_23071.webp',
    '/markalar/111beeztees.jpg',
    '/markalar/5346-trixie_logo.jpg',
    '/markalar/dogit-logo.jpg',
    '/markalar/marca-logo-schesir.jpg',
    '/markalar/petcomfor.jpg',
];

const BrandMarquee: React.FC = () => {
    // Kesintisiz döngü için logoları iki kez ekliyoruz
    const duplicatedBrands = [...BRAND_LOGOS, ...BRAND_LOGOS];

    return (
        <section className="bg-[#FDF8F0] border-y border-gray-100 py-6 overflow-hidden relative">
            {/* Sol gradient mask */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FDF8F0] to-transparent z-10 pointer-events-none" />

            {/* Sağ gradient mask */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FDF8F0] to-transparent z-10 pointer-events-none" />

            <div className="relative">
                <div className="flex animate-marquee">
                    {duplicatedBrands.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="flex-shrink-0 mx-6 flex items-center justify-center w-[140px]"
                        >
                            <div className="w-full h-16 flex items-center justify-center bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all duration-300 border border-gray-50">
                                <img
                                    src={image}
                                    alt={`Marka ${index + 1}`}
                                    className="object-contain max-h-10 max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandMarquee;
