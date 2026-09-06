import React from 'react';

interface RecellLogoProps {
  variant?: 'badge' | 'light' | 'dark' | 'header' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const RecellLogo: React.FC<RecellLogoProps> = ({
  variant = 'header',
  size,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
    '2xl': 'h-20'
  };

  // 'mark'             -> the glossy 3D orange/gold icon+wordmark, for
  //   standalone placements on a near-black/dark-neutral surface (footer).
  //   It's a tall, stacked lockup (icon above wordmark), so it needs more
  //   height than the header logo to keep "RECELL" legible - default to
  //   a taller size unless the caller overrides it.
  if (variant === 'mark') {
    const resolvedSize = size || '2xl';
    const currentSize = sizeClasses[resolvedSize] || sizeClasses['2xl'];
    return (
      <img
        src="/logo-badge-mark.png"
        alt="Recell"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    );
  }

  // 'badge' / 'light'  -> solid white wordmark, for COLORED brand-accent
  //   surfaces (e.g. the solid-orange auth modal banner, the profile page's
  //   thin dark utility bar) where the 3D mark's own orange/gold tones
  //   would lose contrast or where space is too tight for a stacked lockup.
  if (variant === 'badge' || variant === 'light') {
    const resolvedSize = size || 'md';
    const currentSize = sizeClasses[resolvedSize] || sizeClasses.md;
    return (
      <img
        src="/logo-on-dark.svg"
        alt="Recell"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    );
  }

  // 'header' / 'dark' (default) -> the new 3D icon mark (cropped to just
  // the "R + phone/recycle" glyph, which stays legible at nav-bar height)
  // paired with a real HTML text wordmark - crisp at any size, unlike the
  // full stacked raster logo, and fits the header's compact horizontal bar.
  const iconSizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
    '2xl': 'h-20'
  };
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-6xl'
  };
  const resolvedSize = size || 'md';
  const iconSize = iconSizeClasses[resolvedSize] || iconSizeClasses.md;
  const textSize = textSizeClasses[resolvedSize] || textSizeClasses.md;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-icon.png" alt="" className={`${iconSize} w-auto object-contain shrink-0`} />
      <span className={`font-heading font-black tracking-tight text-[#1A1A1A] ${textSize} leading-none`}>
        Re<span className="text-[#C2410C]">C</span>ell
      </span>
    </span>
  );
};
