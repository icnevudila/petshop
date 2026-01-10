import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
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
        { id: 'catalog', icon: Search, label: 'Katalog', action: () => setIsCategoryDrawerOpen(true) },
        { id: 'cart', icon: ShoppingCart, label: 'Sepetim', path: '/sepet', count: cartCount },
        { id: 'favorites', icon: Heart, label: 'Favorilerim', path: '/favoriler', count: wishlistCount },
        { id: 'account', icon: User, label: 'Hesabım', path: '/hesabim' },
    ];

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe pt-2 z-[9999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-5 h-14">
                    {navItems.map((item) => {
                        const isActive = item.path && (currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)));
                        const Icon = item.icon;

                        if (item.action) {
                            return (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <div className="relative">
                                        <Icon size={22} strokeWidth={2} />
                                    </div>
                                    <span className="text-[10px] font-bold">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                to={item.path!}
                                className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="relative">
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} fill={isActive && item.id === 'home' ? 'currentColor' : 'none'} />
                                    {item.count !== undefined && item.count > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                            {item.count > 9 ? '9+' : item.count}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold">{item.label}</span>
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
