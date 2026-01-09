import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface SortOption {
    id: string;
    label: string;
}

interface MobileSortSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (sortId: string) => void;
    currentSort: string;
}

const sortOptions: SortOption[] = [
    { id: 'popular', label: 'Önerilen Sıralama' },
    { id: 'newest', label: 'En Yeniler' },
    { id: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
    { id: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
    { id: 'rating', label: 'En Yüksek Puan' },
    { id: 'discount', label: 'En Çok İndirim' },
];

const MobileSortSheet: React.FC<MobileSortSheetProps> = ({
    isOpen,
    onClose,
    onSelect,
    currentSort,
}) => {
    const handleSelect = (sortId: string) => {
        onSelect(sortId);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className={`mobile-drawer ${isOpen ? 'active' : ''}`} style={{ maxHeight: '60vh' }}>
                {/* Handle */}
                <div className="mobile-drawer-handle" />

                {/* Header */}
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-title">Sıralama</div>
                </div>

                {/* Content */}
                <div className="mobile-drawer-content" style={{ paddingTop: '8px' }}>
                    {sortOptions.map((option) => {
                        const isSelected = currentSort === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 12px',
                                    border: 'none',
                                    background: isSelected ? 'rgba(255, 122, 48, 0.05)' : 'transparent',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    transition: 'background 150ms ease',
                                    marginBottom: '4px',
                                }}
                                onMouseDown={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = '#F5F5F5';
                                    }
                                }}
                                onMouseUp={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '15px',
                                        color: isSelected ? '#FF7A30' : '#2D2D2D',
                                        fontWeight: isSelected ? '600' : '500',
                                    }}
                                >
                                    {option.label}
                                </span>

                                {isSelected && (
                                    <div
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: '#FF7A30',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Check size={16} color="white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileSortSheet;
