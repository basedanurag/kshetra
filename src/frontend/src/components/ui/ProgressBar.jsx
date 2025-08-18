import React from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ value = 0, color = '#3b82f6', label, style = {}, ...props }) {
  return (
    <div style={{ width: '100%', marginBottom: 18, ...style }} {...props}>
      {label && <div style={{ fontWeight: 600, color: '#fff', fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1.01rem', marginBottom: 6 }}>{label}</div>}
      <div style={{ background: '#23233a', borderRadius: 999, height: 14, width: '100%', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color,
            borderRadius: 999,
            boxShadow: `0 2px 8px ${color}33`,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar; 