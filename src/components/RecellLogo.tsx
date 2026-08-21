import React from 'react';

interface RecellLogoProps {
  variant?: 'badge' | 'light' | 'dark' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RecellLogo: React.FC<RecellLogoProps> = ({
  variant = 'header',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Real vector wordmark (public/logo-on-*.svg) - a Poppins-Bold "ReCell"
  // outline plus a refresh-arrow mark, rendered once from the font and
  // baked into path data, so it's crisp at any size with no raster/JPEG
  // artifacts and no font dependency at runtime.
  //
  // 'header' / 'dark'  -> dark slate text + blue accent, for light/white backgrounds
  // 'badge'  / 'light' -> solid white, for dark or brand-blue backgrounds (footer, modal banners)
  const isOnDarkSurface = variant === 'badge' || variant === 'light';
  const src = isOnDarkSurface ? '/logo-on-dark.svg' : '/logo-on-light.svg';

  return (
    <img
      src={src}
      alt="Recell"
      className={`${currentSize} w-auto object-contain ${className}`}
    />
  );
};
