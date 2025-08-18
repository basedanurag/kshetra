import React from "react";

export default function User3DIcon({ size = 48, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="24" cy="43" rx="14" ry="4" fill="#000" opacity="0.13" />
      <ellipse cx="24" cy="30" rx="16" ry="11" fill="url(#body3d)" />
      <circle cx="24" cy="16" r="10" fill="url(#head3d)" />
      <defs>
        <radialGradient id="head3d" cx="0.4" cy="0.3" r="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
        <radialGradient id="body3d" cx="0.5" cy="0.2" r="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
      </defs>
    </svg>
  );
} 