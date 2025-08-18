import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function Modal({ open, onClose, children, className = '', ...props }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className={`bg-surface rounded-2xl shadow-lg p-8 max-w-lg w-full relative ${className}`}
            initial={{ scale: 0.96, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 40 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            {...props}
          >
            {children}
            <button
              className="absolute top-4 right-4 text-white text-xl hover:text-accent-blue focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 