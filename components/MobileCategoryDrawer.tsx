import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileCategoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    {
        id: 'kedi',
        name: 'Kedi',
        image: '/banners/mega_kedi.png',
        path: '/kategori/kedi',
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'kopek',
        name: 'Köpek',
        image: '/banners/mega_kopek.png',
        path: '/kategori/kopek',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'kus',
        name: 'Kuş',
        image: '/banners/mega_kus.png',
        path: '/kategori/kus',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'balik',
        name: 'Balık',
        image: '/banners/mega_balik.png',
        path: '/kategori/balik',
        color: 'from-cyan-500 to-blue-500'
    },
    {
        id: 'kemirgen',
        name: 'Kemirgen',
        image: '/banners/mega_kemirgen.png',
        path: '/kategori/kemirgen',
        color: 'from-purple-500 to-pink-500'
    }
];

const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-[9999] max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                    <h2 className="text-xl font-black text-secondary">Kategoriler</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="p-4 pb-24">
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={onClose}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-md hover:shadow-xl transition-all duration-300 aspect-square"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                                }}
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

                                {/* Image */}
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Label */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <h3 className="text-white font-black text-lg tracking-tight">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* All Categories Button */}
                    <Link
                        to="/kategoriler"
                        onClick={onClose}
                        className="mt-4 w-full bg-secondary text-white py-4 rounded-2xl font-bold text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Search size={20} />
                        Tüm Kategorileri Gör
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MobileCategoryDrawer;
