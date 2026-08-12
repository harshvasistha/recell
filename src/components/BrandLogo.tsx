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

  // Premium vector SVG representations for all 15 major mobile brands
  if (normalizedId.includes('apple')) {
    return (
      <div className={`flex items-center justify-center bg-black text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <svg className="w-full h-full fill-current" viewBox="0 0 384 512">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.1-13.8 69.5-34.3z"/>
        </svg>
      </div>
    );
  }
  if (normalizedId.includes('samsung')) {
    return (
      <div className={`flex items-center justify-center bg-[#034EA2] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black tracking-tighter text-xs sm:text-sm leading-none">SAMSUNG</span>
      </div>
    );
  }
  if (normalizedId.includes('oneplus')) {
    return (
      <div className={`flex items-center justify-center bg-[#EB0029] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full border-2 border-white flex items-center justify-center font-mono font-black text-xs relative rounded-xl">
          1<span className="text-[10px] absolute top-0.5 right-1 font-bold">+</span>
        </div>
      </div>
    );
  }
  if (normalizedId.includes('xiaomi') || normalizedId.includes('redmi')) {
    return (
      <div className={`flex items-center justify-center bg-[#FF6700] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-sm tracking-tighter">mi</span>
      </div>
    );
  }
  if (normalizedId.includes('vivo')) {
    return (
      <div className={`flex items-center justify-center bg-[#0052FF] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans italic font-black text-xs sm:text-sm tracking-tight">vivo</span>
      </div>
    );
  }
  if (normalizedId.includes('oppo')) {
    return (
      <div className={`flex items-center justify-center bg-[#008B5E] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs sm:text-sm tracking-tight">oppo</span>
      </div>
    );
  }
  if (normalizedId.includes('realme')) {
    return (
      <div className={`flex items-center justify-center bg-[#FFC915] text-slate-950 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs tracking-tighter">realme</span>
      </div>
    );
  }
  if (normalizedId.includes('google') || normalizedId.includes('pixel')) {
    return (
      <div className={`flex items-center justify-center bg-white border border-slate-300 text-slate-900 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      </div>
    );
  }
  if (normalizedId.includes('motorola') || normalizedId.includes('moto')) {
    return (
      <div className={`flex items-center justify-center bg-[#5C068C] text-white rounded-full shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-sm leading-none">M</span>
      </div>
    );
  }
  if (normalizedId.includes('nothing')) {
    return (
      <div className={`flex items-center justify-center bg-slate-950 text-white border border-slate-700 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-bold text-xs tracking-widest text-slate-100">NOTHING</span>
      </div>
    );
  }
  if (normalizedId.includes('poco')) {
    return (
      <div className={`flex items-center justify-center bg-[#FFF000] text-slate-950 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-black font-mono text-xs sm:text-sm tracking-tighter">POCO</span>
      </div>
    );
  }
  if (normalizedId.includes('iqoo')) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs sm:text-sm tracking-tight">iQOO</span>
      </div>
    );
  }
  if (normalizedId.includes('asus') || normalizedId.includes('rog')) {
    return (
      <div className={`flex items-center justify-center bg-[#0066B3] text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs sm:text-sm tracking-tighter">ROG</span>
      </div>
    );
  }
  if (normalizedId.includes('honor')) {
    return (
      <div className={`flex items-center justify-center bg-purple-700 text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs tracking-widest">HONOR</span>
      </div>
    );
  }
  if (normalizedId.includes('infinix')) {
    return (
      <div className={`flex items-center justify-center bg-teal-600 text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs tracking-tight">INFINIX</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center bg-slate-900 text-white shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
      <span className="font-mono font-bold text-xs">{brandName?.[0] || 'M'}</span>
    </div>
  );
};
