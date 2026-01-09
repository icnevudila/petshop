import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
    type: 'checkbox' | 'radio';
}

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Record<string, string[]>) => void;
    filterGroups: FilterGroup[];
    initialFilters?: Record<string, string[]>;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    onApply,
    filterGroups,
    initialFilters = {},
}) => {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(initialFilters);

    const handleFilterToggle = (groupId: string, optionId: string, type: 'checkbox' | 'radio') => {
        setSelectedFilters((prev) => {
            const currentGroup = prev[groupId] || [];

            if (type === 'radio') {
                // Radio: only one selection per group
                return {
                    ...prev,
                    [groupId]: [optionId],
                };
            } else {
                // Checkbox: multiple selections
                const isSelected = currentGroup.includes(optionId);
                return {
                    ...prev,
                    [groupId]: isSelected
                        ? currentGroup.filter((id) => id !== optionId)
                        : [...currentGroup, optionId],
                };
            }
        });
    };

    const handleClear = () => {
        setSelectedFilters({});
    };

    const handleApply = () => {
        onApply(selectedFilters);
        onClose();
    };

    const isOptionSelected = (groupId: string, optionId: string) => {
        return (selectedFilters[groupId] || []).includes(optionId);
    };

    const getTotalSelectedCount = () => {
        return Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
                {/* Handle */}
                <div className="mobile-drawer-handle" />

                {/* Header */}
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-title">
                        Filtrele {getTotalSelectedCount() > 0 && `(${getTotalSelectedCount()})`}
                    </div>
                    <button className="mobile-drawer-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="mobile-drawer-content">
                    {filterGroups.map((group) => (
                        <div key={group.id} style={{ marginBottom: '24px' }}>
                            {/* Group Label */}
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#2D2D2D',
                                    marginBottom: '12px',
                                }}
                            >
                                {group.label}
                            </div>

                            {/* Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {group.options.map((option) => {
                                    const isSelected = isOptionSelected(group.id, option.id);

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleFilterToggle(group.id, option.id, group.type)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '12px',
                                                border: `1px solid ${isSelected ? '#FF7A30' : '#E0E0E0'}`,
                                                borderRadius: '12px',
                                                background: isSelected ? 'rgba(255, 122, 48, 0.05)' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {/* Checkbox/Radio */}
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: group.type === 'radio' ? '50%' : '6px',
                                                        border: `2px solid ${isSelected ? '#FF7A30' : '#E0E0E0'}`,
                                                        background: isSelected ? '#FF7A30' : 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 150ms ease',
                                                    }}
                                                >
                                                    {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                                                </div>

                                                {/* Label */}
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        color: isSelected ? '#FF7A30' : '#2D2D2D',
                                                        fontWeight: isSelected ? '600' : '500',
                                                    }}
                                                >
                                                    {option.label}
                                                </span>
                                            </div>

                                            {/* Count */}
                                            {option.count !== undefined && (
                                                <span
                                                    style={{
                                                        fontSize: '13px',
                                                        color: '#9E9E9E',
                                                    }}
                                                >
                                                    ({option.count})
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mobile-drawer-footer">
                    <button
                        className="mobile-drawer-btn mobile-drawer-btn-secondary"
                        onClick={handleClear}
                    >
                        Temizle
                    </button>
                    <button
                        className="mobile-drawer-btn mobile-drawer-btn-primary"
                        onClick={handleApply}
                    >
                        Uygula
                    </button>
                </div>
            </div>
        </>
    );
};

export default MobileFilterDrawer;
