import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function Tooltip({ children, content, show, className = '', ...props }) {
  return (
    <span className="relative group" {...props}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-lg bg-surface text-white text-sm shadow-lg pointer-events-none ${className}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
} 