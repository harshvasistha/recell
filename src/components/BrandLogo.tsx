import React from 'react';
import { MAJOR_MOBILE_BRANDS } from '../data/brandsData';

interface BrandLogoProps {
  brandId: string;
  brandName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandId,
  brandName,
  className = '',
  size = 'md'
}) => {
  const normalizedId = (brandId || brandName || '').toLowerCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-xl p-1.5',
    md: 'w-12 h-12 text-sm rounded-2xl p-2',
    lg: 'w-16 h-16 text-base rounded-2xl p-2.5',
    xl: 'w-20 h-20 text-lg rounded-3xl p-3',
    '2xl': 'w-24 h-24 text-xl rounded-3xl p-4',
  };

  const brandData = MAJOR_MOBILE_BRANDS.find(
    b => b.id.toLowerCase() === normalizedId || b.name.toLowerCase() === normalizedId || normalizedId.includes(b.id)
  );

  if (brandData?.logoUrl) {
    return (
      <div className={`flex items-center justify-center bg-white border border-slate-100 shadow-sm shrink-0 ${sizeClasses[size]} ${className}`}>
        <img src={brandData.logoUrl} alt={brandName || brandId} className="w-full h-full object-contain drop-shadow-sm" />
      </div>
    );
  }

  // Fallback for unknown brands
  return (
    <div className={`flex items-center justify-center bg-slate-900 text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
      <span className="font-mono font-bold text-xs">{brandName?.[0] || 'M'}</span>
    </div>
  );
};
