import { motion } from 'framer-motion';

export default function GlowButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, boxShadow: '0 0 24px 8px #3b82f6, 0 2px 12px #a21caf55' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320 }}
      className={`px-7 py-3 rounded-full font-bold text-white bg-gradient-to-r from-accent-blue to-accent-purple shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
} 