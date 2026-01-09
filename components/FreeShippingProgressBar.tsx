import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';

interface FreeShippingProgressBarProps {
    currentTotal: number;
    threshold?: number;
}

const FreeShippingProgressBar: React.FC<FreeShippingProgressBarProps> = ({ currentTotal, threshold = 799 }) => {
    const progress = Math.min((currentTotal / threshold) * 100, 100);
    const remaining = Math.max(threshold - currentTotal, 0);
    const isFree = currentTotal >= threshold;

    return (
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFree ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isFree ? <CheckCircle2 size={20} /> : <Truck size={20} />}
                </div>
                <div>
                    {isFree ? (
                        <p className="text-sm font-bold text-green-700">Kargo Bedava! 🎉</p>
                    ) : (
                        <p className="text-sm font-medium text-gray-700">
                            Kargo bedava için <span className="font-black text-brand">{remaining.toLocaleString('tr-TR')} TL</span> daha ürün ekleyin.
                        </p>
                    )}
                </div>
            </div>

            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isFree ? 'bg-green-500' : 'bg-brand'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default FreeShippingProgressBar;
