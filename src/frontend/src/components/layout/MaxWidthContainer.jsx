import React from 'react';

export default function MaxWidthContainer({ children, className = '', ...props }) {
  return (
    <div className={`max-w-7xl mx-auto px-6 w-full ${className}`} {...props}>
      {children}
    </div>
  );
} 