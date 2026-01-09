import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
    cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ cartCount }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        {
            id: 'home',
            label: 'Ana Sayfa',
            icon: Home,
            path: '/',
            badge: null,
        },
        {
            id: 'categories',
            label: 'Kategoriler',
            icon: Grid,
            path: '/kategoriler',
            badge: null,
        },
        {
            id: 'search',
            label: 'Ara',
            icon: Search,
            path: '/ara',
            badge: null,
        },
        {
            id: 'cart',
            label: 'Sepet',
            icon: ShoppingCart,
            path: '/sepet',
            badge: cartCount > 0 ? cartCount : null,
        },
        {
            id: 'account',
            label: 'Hesabım',
            icon: User,
            path: '/giris',
            badge: null,
        },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleNavClick = (path: string, id: string) => {
        if (id === 'categories') {
            // Show categories modal/drawer instead of navigating
            // For now, navigate to first category
            navigate('/kategori/kedi-mamasi');
        } else if (id === 'search') {
            // Show search overlay
            // For now, just focus on search if on home
            navigate('/');
        } else {
            navigate(path);
        }
    };

    return (
        <nav className="mobile-bottom-nav mobile-only">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                    <button
                        key={item.id}
                        onClick={() => handleNavClick(item.path, item.id)}
                        className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
                        aria-label={item.label}
                    >
                        <Icon />
                        {item.badge !== null && (
                            <span className="mobile-bottom-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                        )}
                        <span className="mobile-bottom-nav-label">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
