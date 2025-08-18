import React from 'react';

export default function Badge({ children, className = '', ...props }) {
  return (
    <span
      className={`inline-block px-4 py-1 rounded-full font-semibold text-xs bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-md ${className}`}
      {...props}
    >
      {children}
    </span>
  );
} 