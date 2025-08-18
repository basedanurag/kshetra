import React from 'react';

export default function Avatar({ src, alt, size = 48, className = '', children }) {
  return (
    <div
      className={`rounded-full bg-surface border-2 border-accent-blue shadow-lg flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold text-lg">{children}</span>
      )}
    </div>
  );
} 