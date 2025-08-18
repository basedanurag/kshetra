import React from 'react';
import { motion } from 'framer-motion';

function Tabs({ tabs = [], value, onChange, style = {}, ...props }) {
  const activeIndex = tabs.findIndex(tab => tab.value === value);
  return (
    <div style={{ display: 'flex', gap: 0, background: '#181a22', borderRadius: 999, padding: 4, ...style }} {...props}>
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          onClick={() => onChange && onChange(tab.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'none',
            border: 'none',
            color: value === tab.value ? '#fff' : '#A0A0A0',
            fontWeight: 700,
            fontFamily: 'Inter, DM Sans, sans-serif',
            fontSize: '1.08rem',
            borderRadius: 999,
            padding: '0.7rem 2.1rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'color 0.18s',
          }}
          aria-selected={value === tab.value}
          tabIndex={0}
        >
          {tab.label}
          {value === tab.value && (
            <motion.div
              layoutId="tab-indicator"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)',
                borderRadius: 999,
                zIndex: -1,
                boxShadow: '0 2px 8px #3b82f655',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs; 