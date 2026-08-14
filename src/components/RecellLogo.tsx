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

  // Since the user wants the exact logo provided, we use an image tag.
  // The user needs to ensure the image is uploaded to the public directory as "logo.jpg".
  const logoContent = (
    <img 
      src="/logo.jpg" 
      alt="Recell Logo" 
      className={`${currentSize} w-auto object-contain ${className}`}
      onError={(e) => {
        // Fallback styling if the image isn't uploaded yet
        e.currentTarget.style.display = 'none';
        if (e.currentTarget.nextElementSibling) {
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
        }
      }}
    />
  );

  const fallbackContent = (
    <div className={`hidden font-black tracking-tighter text-slate-900 ${size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : size === 'xl' ? 'text-4xl' : 'text-2xl'} ${className}`}>
      Re<span className="text-[#0052FF]">C</span>ell
    </div>
  );

  if (variant === 'badge') {
    return (
      <div className={`bg-slate-900 px-3 py-1.5 rounded-xl shadow-md inline-flex items-center ${className}`}>
        {logoContent}
        {fallbackContent}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {logoContent}
      {fallbackContent}
    </div>
  );
};
