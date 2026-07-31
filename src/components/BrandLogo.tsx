import React from 'react';

interface BrandLogoProps {
  brandId: string;
  brandName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandId,
  brandName,
  className = '',
  size = 'md'
}) => {
  const normalizedId = (brandId || brandName || '').toLowerCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  // Premium vector SVG representations for all 15 major mobile brands
  if (normalizedId.includes('apple')) {
    return (
      <div className={`flex items-center justify-center bg-black text-white rounded-2xl p-2 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <svg className="w-full h-full fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.84.13-9.75-1.93-14.73-6.19-3.23-2.77-7.14-7.46-11.75-14.07-6.73-9.66-12.03-20.69-15.91-33.09-3.88-12.4-5.82-24.18-5.82-35.34 0-14.36 3.61-26.35 10.84-35.98 7.23-9.62 16.34-14.56 27.33-14.82 5.09 0 10.51 1.25 16.27 3.76 5.76 2.51 9.77 3.86 12.03 4.05 1.76-.19 5.8-1.54 12.12-4.05 6.32-2.51 11.52-3.67 15.6-3.48 10.56.64 19.34 4.8 26.34 12.48-9.45 5.74-14.07 13.84-13.86 24.31.22 8.16 3.39 15.22 9.5 21.18 6.11 5.96 13.51 9.4 22.2 10.33-2.19 6.74-5.02 13.52-8.5 20.35zM119.22 31.86c0-6.66 2.44-13.1 7.33-19.32 4.89-6.22 11.09-10.3 18.6-12.24.64 8.01-1.7 15.42-7.03 22.23-5.32 6.81-11.83 10.74-19.53 11.8-0.08-.82-.13-1.64-.13-2.47z"/>
        </svg>
      </div>
    );
  }

  if (normalizedId.includes('samsung')) {
    return (
      <div className={`flex items-center justify-center bg-[#034EA2] text-white rounded-2xl p-1.5 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black tracking-tighter text-xs sm:text-sm leading-none">SAMSUNG</span>
      </div>
    );
  }

  if (normalizedId.includes('oneplus')) {
    return (
      <div className={`flex items-center justify-center bg-[#EB0029] text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full border-2 border-white flex items-center justify-center font-mono font-black text-xs relative rounded-xl">
          1<span className="text-[10px] absolute top-0.5 right-1 font-bold">+</span>
        </div>
      </div>
    );
  }

  if (normalizedId.includes('xiaomi') || normalizedId.includes('redmi')) {
    return (
      <div className={`flex items-center justify-center bg-[#FF6700] text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-sm tracking-tighter">mi</span>
      </div>
    );
  }

  if (normalizedId.includes('vivo')) {
    return (
      <div className={`flex items-center justify-center bg-[#0052FF] text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans italic font-black text-xs sm:text-sm tracking-tight">vivo</span>
      </div>
    );
  }

  if (normalizedId.includes('oppo')) {
    return (
      <div className={`flex items-center justify-center bg-[#008B5E] text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs sm:text-sm tracking-tight">oppo</span>
      </div>
    );
  }

  if (normalizedId.includes('realme')) {
    return (
      <div className={`flex items-center justify-center bg-[#FFC915] text-slate-950 rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs tracking-tighter">realme</span>
      </div>
    );
  }

  if (normalizedId.includes('google') || normalizedId.includes('pixel')) {
    return (
      <div className={`flex items-center justify-center bg-white border border-slate-300 text-slate-900 rounded-2xl p-2 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
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
      <div className={`flex items-center justify-center bg-[#5C068C] text-white rounded-full p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-sm leading-none">M</span>
      </div>
    );
  }

  if (normalizedId.includes('nothing')) {
    return (
      <div className={`flex items-center justify-center bg-slate-950 text-white border border-slate-700 rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-bold text-xs tracking-widest text-slate-100">NOTHING</span>
      </div>
    );
  }

  if (normalizedId.includes('poco')) {
    return (
      <div className={`flex items-center justify-center bg-[#FFF000] text-slate-950 rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-black font-mono text-xs sm:text-sm tracking-tighter">POCO</span>
      </div>
    );
  }

  if (normalizedId.includes('iqoo')) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs sm:text-sm tracking-tight">iQOO</span>
      </div>
    );
  }

  if (normalizedId.includes('asus') || normalizedId.includes('rog')) {
    return (
      <div className={`flex items-center justify-center bg-[#0066B3] text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs sm:text-sm tracking-tighter">ROG</span>
      </div>
    );
  }

  if (normalizedId.includes('honor')) {
    return (
      <div className={`flex items-center justify-center bg-purple-700 text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-sans font-black text-xs tracking-widest">HONOR</span>
      </div>
    );
  }

  if (normalizedId.includes('infinix')) {
    return (
      <div className={`flex items-center justify-center bg-teal-600 text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="font-mono font-black text-xs tracking-tight">INFINIX</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-slate-900 text-white rounded-2xl p-1 shadow-md shrink-0 ${sizeClasses[size]} ${className}`}>
      <span className="font-mono font-bold text-xs">{brandName?.[0] || 'M'}</span>
    </div>
  );
};
