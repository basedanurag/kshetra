import React from "react";

// Simple outlined Web3-inspired SVG icons
export function IconConnect(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <rect x={6} y={10} width={24} height={16} rx={5} stroke="#6B46C1" fill="none" />
      <path d="M12 18h12" stroke="#0066ff" />
      <circle cx={12} cy={18} r={2} fill="#EC4899" />
      <circle cx={24} cy={18} r={2} fill="#EC4899" />
    </svg>
  );
}

export function IconExplore(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <circle cx={18} cy={18} r={15} stroke="#6B46C1" />
      <path d="M18 6v12l8 8" stroke="#0066ff" />
      <circle cx={18} cy={18} r={2} fill="#EC4899" />
    </svg>
  );
}

export function IconOwnTrade(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <rect x={8} y={8} width={20} height={20} rx={5} stroke="#6B46C1" />
      <path d="M14 22l4-4 4 4" stroke="#0066ff" />
      <circle cx={18} cy={18} r={2} fill="#EC4899" />
    </svg>
  );
}

export function IconSecurity(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <rect x={10} y={14} width={16} height={10} rx={4} stroke="#6B46C1" />
      <path d="M18 14v-4a4 4 0 0 1 8 0v4" stroke="#0066ff" />
      <circle cx={18} cy={19} r={2} fill="#EC4899" />
    </svg>
  );
}

export function IconInstant(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <circle cx={18} cy={18} r={15} stroke="#6B46C1" />
      <path d="M18 18l7-7" stroke="#0066ff" />
      <path d="M18 8v10h10" stroke="#EC4899" />
    </svg>
  );
}

export function IconGlobal(props) {
  return (
    <svg width={36} height={36} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 36" {...props}>
      <circle cx={18} cy={18} r={15} stroke="#6B46C1" />
      <ellipse cx={18} cy={18} rx={10} ry={15} stroke="#0066ff" />
      <ellipse cx={18} cy={18} rx={15} ry={6} stroke="#EC4899" />
    </svg>
  );
} 