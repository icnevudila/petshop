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
        <div className="w-full bg-[#fcfcfc] py-4 md:hidden border-b border-gray-50 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 snap-x">
                {STORIES.map((story) => (
                    <Link key={story.id} to={story.link} className="flex flex-col items-center gap-2 flex-shrink-0 snap-center group cursor-pointer">
                        <div className={`p-[2px] rounded-full ring-2 ${story.ringColor} ring-offset-2 transition-all group-hover:scale-105`}>
                            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 p-1.5 overflow-hidden">
                                <img src={story.img} alt={story.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-700 truncate max-w-[70px] tracking-wide">{story.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StoryNavigation;
