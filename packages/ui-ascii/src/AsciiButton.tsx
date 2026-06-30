import React from 'react';

export interface AsciiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost';
  style?: React.CSSProperties;
}

export const AsciiButton: React.FC<AsciiButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  style
}) => {

  let variantClasses = '';
  switch(variant) {
    case 'primary':
      variantClasses = "bg-[#33FF33] text-black shadow-[0_0_10px_rgba(51,255,51,0.6)] hover:bg-[#C0FFC0]";
      break;
    case 'secondary':
      variantClasses = "bg-[#005500] text-[#33FF33] border border-[#33FF33] hover:bg-[#33FF33] hover:text-black hover:shadow-[0_0_15px_rgba(51,255,51,0.8)]";
      break;
    case 'alert':
      variantClasses = "border border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333]/20 hover:text-white hover:shadow-[0_0_15px_rgba(255,51,51,0.8)]";
      break;
    case 'ghost':
      variantClasses = "text-[#00AA00] hover:text-[#33FF33] hover:shadow-[0_0_10px_rgba(192,255,192,0.5)]";
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`px-4 py-1 text-sm font-bold flex items-center justify-center transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};
