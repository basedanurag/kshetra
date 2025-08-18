import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Accordion({ items = [], openIndexes = [], onToggle, style = {}, ...props }) {
  return (
    <div style={{ width: '100%', ...style }} {...props}>
      {items.map((item, i) => {
        const isOpen = openIndexes.includes(i);
        return (
          <div key={i} style={{ marginBottom: 12, borderRadius: 12, background: '#23233a', boxShadow: '0 2px 8px #3b82f655', overflow: 'hidden' }}>
            <button
              onClick={() => onToggle && onToggle(i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontFamily: 'Inter, DM Sans, sans-serif',
                fontSize: '1.08rem',
                padding: '1.1rem 1.6rem',
                cursor: 'pointer',
                outline: 'none',
                borderBottom: isOpen ? '1.5px solid #3b82f6' : '1.5px solid #23233a',
                transition: 'border 0.18s',
              }}
              aria-expanded={isOpen}
              tabIndex={0}
            >
              {item.label}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ overflow: 'hidden', background: '#181a22', padding: '0 1.6rem 1.1rem 1.6rem', color: '#A0A0A0', fontSize: '1.01rem', fontWeight: 500 }}
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion; 