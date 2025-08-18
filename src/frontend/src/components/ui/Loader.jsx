import { motion } from 'framer-motion';

export default function Loader({ size = 32, color = '#3b82f6', className = '' }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          stroke={color}
          strokeWidth="4"
          strokeDasharray="60 40"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
} 