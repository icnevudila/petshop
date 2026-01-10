import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingCart, Heart, User, PawPrint, Package } from 'lucide-react';
import MobileCategoryDrawer from './MobileCategoryDrawer';

interface MobileBottomNavProps {
    cartCount: number;
    wishlistCount: number;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ cartCount, wishlistCount }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

    const navItems = [
        { id: 'home', icon: Home, label: 'Anasayfa', path: '/' },
        { id: 'catalog', icon: PawPrint, label: 'Katalog', action: () => setIsCategoryDrawerOpen(true) },
        { id: 'cart', icon: ShoppingCart, label: 'Sepetim', path: '/sepet', count: cartCount },
        { id: 'favorites', icon: Heart, label: 'Favorilerim', path: '/favoriler', count: wishlistCount },
        { id: 'account', icon: User, label: 'Hesabım', path: '/hesabim' },
    ];

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-lg border-t border-gray-100 px-2 pb-safe pt-2 z-[9999] shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-5 h-14">
                    {navItems.map((item) => {
                        const isActive = item.path && (currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)));
                        const Icon = item.icon;

                        if (item.action) {
                            return (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${isActive ? 'text-brand' : 'text-gray-400'}`}
                                >
                                    {isActive && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-brand/0 via-brand to-brand/0 rounded-full" />
                                    )}
                                    <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-brand' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                to={item.path!}
                                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${isActive ? 'text-brand' : 'text-gray-400'}`}
                            >
                                {isActive && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-brand/0 via-brand to-brand/0 rounded-full" />
                                )}
                                <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} fill={isActive && (item.id === 'home' || item.id === 'favorites' || item.id === 'catalog') ? 'currentColor' : 'none'} />
                                    {item.count !== undefined && item.count > 0 && (
                                        <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 ${item.id === 'cart' ? 'bg-gradient-to-br from-brand to-orange-600' : 'bg-gradient-to-br from-red-500 to-pink-500'} text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-lg animate-pulse`}>
                                            {item.count > 9 ? '9+' : item.count}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-brand' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <MobileCategoryDrawer
                isOpen={isCategoryDrawerOpen}
                onClose={() => setIsCategoryDrawerOpen(false)}
            />
        </>
    );
};

export default MobileBottomNav;
