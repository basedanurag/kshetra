import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Pill({ children, onClose, color = '#3b82f6', style = {}, ...props }) {
  return (
    <AnimatePresence>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#23233a',
          color,
          borderRadius: 999,
          fontWeight: 700,
          fontFamily: 'Inter, DM Sans, sans-serif',
          fontSize: '1.01rem',
          padding: '0.38rem 1.1rem',
          boxShadow: `0 2px 8px ${color}33`,
          ...style,
        }}
        {...props}
      >
        {children}
        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.18, background: color, color: '#fff' }}
            whileTap={{ scale: 0.92 }}
            style={{
              marginLeft: 6,
              background: 'none',
              border: 'none',
              color,
              borderRadius: 999,
              fontWeight: 900,
              fontSize: '1.1em',
              cursor: 'pointer',
              padding: '0.1em 0.5em',
              outline: 'none',
              transition: 'background 0.18s, color 0.18s',
            }}
            aria-label="Remove"
            tabIndex={0}
          >
            ×
          </motion.button>
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export default Pill; 