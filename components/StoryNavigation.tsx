import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const STORIES = [
    { id: 1, name: 'İndirimler', img: '/stories/discount.png', link: '/kategori/kedi-mamasi', ringColor: 'ring-rose-500' },
    { id: 2, name: 'Yeni', img: '/stories/new.png', link: '/kategori/kopek-mamasi', ringColor: 'ring-brand' },
    { id: 3, name: 'Çok Satan', img: '/stories/bestseller.png', link: '/kategori/kedi-kumu', ringColor: 'ring-blue-500' },
    { id: 4, name: 'Kedi', img: '/banners/mega_kedi.png', link: '/kategori/kedi', ringColor: 'ring-gray-200' },
    { id: 5, name: 'Köpek', img: '/banners/mega_kopek.png', link: '/kategori/kopek', ringColor: 'ring-gray-200' },
    { id: 6, name: 'Kuş', img: '/banners/mega_kus.png', link: '/kategori/kus', ringColor: 'ring-gray-200' },
    { id: 7, name: 'Balık', img: '/banners/mega_balik.png', link: '/kategori/balik', ringColor: 'ring-gray-200' },
    { id: 8, name: 'Kemirgen', img: '/banners/mega_kemirgen.png', link: '/kategori/kemirgen', ringColor: 'ring-gray-200' },
];

const StoryNavigation: React.FC = () => {
    return (
        <div className="w-full bg-white py-6 md:py-8 border-b border-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar px-2 snap-x md:justify-center pb-2">
                    {STORIES.map((story) => (
                        <Link key={story.id} to={story.link} className="flex flex-col items-center gap-3 flex-shrink-0 snap-center group cursor-pointer relative">
                            {/* Pulse Effect for Special Items */}
                            {(story.name === 'İndirimler' || story.name === 'Yeni') && (
                                <div className={`absolute inset-0 rounded-full ${story.ringColor.replace('ring-', 'bg-')}/30 animate-pulse-ring pointer-events-none transform scale-125`}></div>
                            )}

                            <div className={`p-[3px] rounded-full ring-2 ${story.ringColor} ring-offset-2 transition-all duration-300 group-hover:scale-110 group-hover:ring-offset-4 shadow-sm`}>
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-gray-100 p-1.5 overflow-hidden relative z-10">
                                    <img src={story.img} alt={story.name} className="w-full h-full object-cover rounded-full transform transition-transform group-hover:scale-110" />
                                </div>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-gray-700 truncate max-w-[80px] tracking-wide group-hover:text-primary transition-colors">{story.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryNavigation;
