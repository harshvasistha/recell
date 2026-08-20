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

  // The 3D-rendered logo (public/logo.jpg) has its own dark studio backdrop
  // baked into the image (no transparency, since it's a JPEG render, not a
  // cut-out mark) - so it's always shown inside a matching dark rounded chip
  // rather than sitting directly on whatever background the surrounding page
  // happens to have. That keeps it looking intentional everywhere it's used
  // (white header, dark footer, badge) instead of showing as a stray black
  // rectangle on light backgrounds.
  const logoContent = (
    <img
      src="/logo.jpg"
      alt="Recell Logo"
      className={`${currentSize} w-auto object-contain rounded-lg ${className}`}
      onError={(e) => {
        // Fallback styling if the image isn't uploaded yet
        e.currentTarget.style.display = 'none';
        const chip = e.currentTarget.closest('[data-logo-chip]') as HTMLElement | null;
        if (chip) chip.style.display = 'none';
        if (e.currentTarget.parentElement?.nextElementSibling) {
          (e.currentTarget.parentElement.nextElementSibling as HTMLElement).style.display = 'block';
        }
      }}
    />
  );

  const fallbackContent = (
    <div className={`hidden font-black tracking-tighter text-slate-900 ${size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : size === 'xl' ? 'text-4xl' : 'text-2xl'} ${className}`}>
      Re<span className="text-[#0052FF]">C</span>ell
    </div>
  );

  return (
    <div className="flex items-center">
      <div data-logo-chip className="bg-slate-950 px-2.5 py-1.5 rounded-xl shadow-md inline-flex items-center">
        {logoContent}
      </div>
      {fallbackContent}
    </div>
  );
};
