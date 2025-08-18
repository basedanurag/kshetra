import { motion } from 'framer-motion';
import React from 'react';

export default function TiltCard({ children, className = '', style = {}, ...props }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
        borderRadius: 16,
        boxShadow: '0 4px 32px #3b82f655, 0 1.5px 0 #3b82f6',
        background: 'linear-gradient(135deg, #23233a 80%, #3b82f6 100%)',
        transform: `rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg) scale(1.02)`,
        transition: 'transform 0.18s cubic-bezier(.4,0,.2,1)',
        ...style
      }}
      whileHover={{ scale: 1.04 }}
      className={`rounded-2xl shadow-lg ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
} 