import React from 'react';
import { X, ChevronRight, LogOut, User, Heart, Package, MapPin, HelpCircle, FileText, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn?: boolean;
    userName?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isLoggedIn = false, userName = 'Kullanıcı' }) => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Kedi Maması', slug: 'kedi-mamasi', icon: '🐱' },
        { name: 'Köpek Maması', slug: 'kopek-mamasi', icon: '🐶' },
        { name: 'Kuş Ürünleri', slug: 'kus-urunleri', icon: '🦜' },
        { name: 'Balık Ürünleri', slug: 'balik-urunleri', icon: '🐠' },
        { name: 'Kemirgen Ürünleri', slug: 'kemirgen-urunleri', icon: '🐹' },
        { name: 'Tavşan Ürünleri', slug: 'tavsan-urunleri', icon: '🐰' },
    ];

    const accountLinks = [
        { name: 'Siparişlerim', icon: Package, path: '/siparislerim' },
        { name: 'Favorilerim', icon: Heart, path: '/favoriler' },
        { name: 'Adreslerim', icon: MapPin, path: '/adreslerim' },
    ];

    const generalLinks = [
        { name: 'Hakkımızda', icon: FileText, path: '/hakkimizda' },
        { name: 'İletişim', icon: Phone, path: '/iletisim' },
        { name: 'Yardım', icon: HelpCircle, path: '/yardim' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Menu Drawer */}
            <div className={`mobile-drawer ${isOpen ? 'active' : ''}`} style={{ maxHeight: '100vh', borderRadius: 0 }}>
                {/* Header */}
                <div className="mobile-drawer-header" style={{ borderBottom: 'none' }}>
                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF7A30, #e86a20)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '18px',
                                }}
                            >
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px', color: '#2D2D2D' }}>{userName}</div>
                                <div style={{ fontSize: '13px', color: '#757575' }}>Hesabım</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mobile-drawer-title">Menü</div>
                    )}
                    <button className="mobile-drawer-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="mobile-drawer-content" style={{ paddingTop: '8px' }}>
                    {/* Account Section (if logged in) */}
                    {isLoggedIn && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#9E9E9E', marginBottom: '12px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Hesabım
                            </div>
                            {accountLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavigation(link.path)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '14px 12px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            borderRadius: '12px',
                                            transition: 'background 150ms ease',
                                            marginBottom: '4px',
                                        }}
                                        onMouseDown={(e) => {
                                            e.currentTarget.style.background = '#F5F5F5';
                                        }}
                                        onMouseUp={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Icon size={20} color="#757575" />
                                            <span style={{ fontSize: '15px', color: '#2D2D2D', fontWeight: '500' }}>{link.name}</span>
                                        </div>
                                        <ChevronRight size={20} color="#9E9E9E" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Categories Section */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#9E9E9E', marginBottom: '12px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Kategoriler
                        </div>
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => handleNavigation(`/kategori/${category.slug}`)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 12px',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    transition: 'background 150ms ease',
                                    marginBottom: '4px',
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.background = '#F5F5F5';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>{category.icon}</span>
                                    <span style={{ fontSize: '15px', color: '#2D2D2D', fontWeight: '500' }}>{category.name}</span>
                                </div>
                                <ChevronRight size={20} color="#9E9E9E" />
                            </button>
                        ))}
                    </div>

                    {/* General Links */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#9E9E9E', marginBottom: '12px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Bilgi
                        </div>
                        {generalLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavigation(link.path)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 12px',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        transition: 'background 150ms ease',
                                        marginBottom: '4px',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.background = '#F5F5F5';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Icon size={20} color="#757575" />
                                        <span style={{ fontSize: '15px', color: '#2D2D2D', fontWeight: '500' }}>{link.name}</span>
                                    </div>
                                    <ChevronRight size={20} color="#9E9E9E" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Login/Logout Button */}
                    {isLoggedIn ? (
                        <button
                            onClick={() => {
                                // Handle logout
                                onClose();
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px',
                                border: '1px solid #E0E0E0',
                                background: 'transparent',
                                cursor: 'pointer',
                                borderRadius: '12px',
                                color: '#E74C3C',
                                fontWeight: '600',
                                fontSize: '15px',
                                marginTop: '16px',
                            }}
                        >
                            <LogOut size={20} />
                            Çıkış Yap
                        </button>
                    ) : (
                        <button
                            onClick={() => handleNavigation('/giris')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #FF7A30, #e86a20)',
                                cursor: 'pointer',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '15px',
                                marginTop: '16px',
                            }}
                        >
                            <User size={20} />
                            Giriş Yap / Kayıt Ol
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
