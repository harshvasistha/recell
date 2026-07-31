import React from 'react';

interface RecellLogoProps {
  variant?: 'badge' | 'light' | 'dark' | 'header';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RecellLogo: React.FC<RecellLogoProps> = ({
  variant = 'header',
  size = 'md',
  className = ''
}) => {
  // Size classes
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-base font-black tracking-wider',
    md: 'text-xl font-black tracking-wider',
    lg: 'text-2xl font-black tracking-wider'
  };

  if (variant === 'badge') {
    // Exact match of uploaded image: White RECELL text on Royal Blue Background with circular recycle arrow C
    return (
      <div className={`bg-[#0052FF] text-white px-3.5 py-1.5 rounded-xl shadow-md inline-flex items-center gap-1 font-sans ${className}`}>
        <span className="font-black tracking-tight text-lg sm:text-xl">RE</span>
        {/* Recycle / Recommerce Arrow replacing C */}
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21 12A9 9 0 1 1 12 3C15.5 3 18.5 5 20 8" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 8H20.5V3.5" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        <span className="font-black tracking-tight text-lg sm:text-xl">ELL</span>
      </div>
    );
  }

  // Header / Light Mode Variant
  return (
    <div className={`flex items-center gap-1 font-sans cursor-pointer group select-none ${className}`}>
      {/* Icon Badge */}
      <div className="w-8 h-8 rounded-xl bg-[#0052FF] text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
        <svg 
          className="w-5 h-5 text-white stroke-[2.5]" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21 12A9 9 0 1 1 12 3C15.5 3 18.5 5 20 8" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 8H20.5V3.5" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* RECELL Text */}
      <div className="flex items-baseline font-black tracking-tighter text-slate-900 text-xl font-sans">
        <span className="text-slate-900">RE</span>
        <span className="text-[#0052FF] flex items-center inline-block mx-[0.5px]">
          <svg 
            className="w-4 h-4 text-[#0052FF] stroke-[3] inline-block -mt-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 12A9 9 0 1 1 12 3C15.5 3 18.5 5 20 8" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M16 8H20.5V3.5" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </span>
        <span className="text-slate-900">ELL</span>
        <span className="bg-[#EFF6FF] text-[#0052FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ml-1.5 -translate-y-0.5">
          PRO
        </span>
      </div>
    </div>
  );
};
