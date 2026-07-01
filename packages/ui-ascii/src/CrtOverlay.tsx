import React from 'react';
import './global-crt.css';

export const CrtOverlay: React.FC = () => {
  return (
    <div className="crt-overlay">
      <div className="scanline"></div>
      <div className="static-noise"></div>
    </div>
  );
};
