import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const typeStyles = {
  success: { background: '#23233a', color: '#22c55e', borderLeft: '4px solid #22c55e' },
  error: { background: '#23233a', color: '#ef4444', borderLeft: '4px solid #ef4444' },
  info: { background: '#23233a', color: '#3b82f6', borderLeft: '4px solid #3b82f6' },
  warning: { background: '#23233a', color: '#f59e42', borderLeft: '4px solid #f59e42' },
};

function Alert({ type = 'info', message, onClose, style = {}, ...props }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderRadius: 12,
            fontWeight: 600,
            fontFamily: 'Inter, DM Sans, sans-serif',
            fontSize: '1.05rem',
            padding: '1.1rem 1.6rem',
            marginBottom: 18,
            boxShadow: '0 2px 12px #3b82f655',
            ...typeStyles[type],
            ...style,
          }}
          {...props}
        >
          <span style={{ flex: 1 }}>{message}</span>
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.18, color: '#fff', background: typeStyles[type].color }}
              whileTap={{ scale: 0.92 }}
              style={{
                background: 'none',
                border: 'none',
                color: typeStyles[type].color,
                borderRadius: 999,
                fontWeight: 900,
                fontSize: '1.1em',
                cursor: 'pointer',
                padding: '0.1em 0.5em',
                outline: 'none',
                transition: 'background 0.18s, color 0.18s',
              }}
              aria-label="Close"
              tabIndex={0}
            >
              ×
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert; 