import React from 'react';

export interface AsciiBoxProps {
  children?: React.ReactNode;
  width?: number | string;
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const AsciiBox: React.FC<AsciiBoxProps> = ({ children, title, className = '', style, onClick }) => {
  return (
    <div
      className={`crt-box group flex flex-col h-full bg-black/60 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {title && (
        <div className="flex justify-between items-start mb-2 relative z-10">
          <h3 className="text-xl font-bold text-[#C0FFC0] glow-text-light group-hover:text-[#33FF33] flex items-center">
            {title}
          </h3>
        </div>
      )}
      <div className="flex-grow relative z-10 text-sm text-[#00AA00]">
        {children}
      </div>
    </div>
  );
};
