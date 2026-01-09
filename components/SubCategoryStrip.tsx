
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SUB_CATEGORIES = [
    { name: 'Kuru Mama', image: '/banners/kuru_mama.png', slug: 'kedi' },
    { name: 'Yaş Mama', image: '/banners/yas_mama.png', slug: 'kedi' },
    { name: 'Kedi Kumu', image: '/banners/kedi_kumu.png', slug: 'kedi' },
    { name: 'Ödül', image: '/banners/odul.png', slug: 'kopek' },
    { name: 'Oyuncak', image: '/banners/oyuncak.png', slug: 'kopek' },
    { name: 'Tasma', image: '/banners/tasma.png', slug: 'kopek' },
    { name: 'Yatak', image: '/banners/yatak.png', slug: 'kedi' },
    { name: 'Bakım', image: '/banners/bakim.png', slug: 'kopek' },
];

const SubCategoryStrip: React.FC = () => {
    return (
        <div className="bg-white border-b border-gray-100 py-6 hidden md:block shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {SUB_CATEGORIES.map((cat, i) => (
                        <Link key={i} to={`/kategori/${cat.slug}`} className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 p-1 group-hover:border-primary group-hover:scale-110 transition-all duration-300 overflow-hidden shadow-sm">
                                {/* Placeholder icon since we don't have real images yet, defaulting to colored divs if images fail */}
                                <div className="w-full h-full rounded-full bg-gray-200 group-hover:bg-orange-50 transition-colors flex items-center justify-center text-[10px] text-gray-400">
                                    {cat.name.charAt(0)}
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-primary transition-colors text-center leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                    <div className="w-px h-12 bg-gray-100 mx-2"></div>
                    <Link to="/kategori/kedi" className="flex items-center gap-2 text-xs font-black text-primary hover:text-orange-700 whitespace-nowrap">
                        Tümünü Gör <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubCategoryStrip;
