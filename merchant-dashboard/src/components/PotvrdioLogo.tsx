import React from 'react';

interface PotvrdioLogoProps {
  variant?: 'icon' | 'horizontal' | 'stacked';
  mode?: 'dark' | 'light';
  className?: string;
  showSuffix?: boolean;
}

export const PotvrdioLogo: React.FC<PotvrdioLogoProps> = ({
  variant = 'horizontal',
  mode = 'dark',
  className = '',
  showSuffix = true,
}) => {
  const isDark = mode === 'dark';

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img 
          src={isDark ? "/logo-icon-dark.png" : "/logo-icon-light.png"} 
          alt="Potvrdio Logo Icon" 
          className="w-full h-full object-contain select-none"
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img 
          src={isDark ? "/logo-stacked-dark.png" : "/logo-stacked-light.png"} 
          alt="Potvrdio Logo" 
          className="w-full h-auto object-contain"
          loading="eager"
        />
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
        <img 
          src={isDark ? "/logo-icon-dark.png" : "/logo-icon-light.png"} 
          alt="Potvrdio" 
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
      <div className="flex items-baseline">
        <span className={`font-extrabold text-lg tracking-tight ${isDark ? 'text-white' : 'text-[#361F6F]'}`}>
          Potvrdio
        </span>
        {showSuffix && (
          <span className="font-semibold text-sm text-[#22AF75]">
            .online
          </span>
        )}
      </div>
    </div>
  );
};
