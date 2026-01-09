import React from 'react';

const SkeletonProductCard: React.FC = () => {
    return (
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
            <div className="relative aspect-square mb-4 bg-gray-100 rounded-2xl" />

            <div className="space-y-3">
                {/* Brand Name */}
                <div className="h-3 bg-gray-100 rounded w-1/3" />

                {/* Product Name */}
                <div className="space-y-1">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-3 h-3 bg-gray-100 rounded-full" />
                    ))}
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                        <div className="h-3 bg-gray-100 rounded w-12" />
                        <div className="h-5 bg-gray-100 rounded w-20" />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
