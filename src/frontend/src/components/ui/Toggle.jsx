import React from 'react';
import { motion } from 'framer-motion';

function Toggle({
  checked = false,
  onChange,
  label,
  disabled = false,
  required = false,
  id,
  ...props
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <label htmlFor={id} style={{ fontWeight: 600, color: '#fff', fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1.05rem', letterSpacing: '0.01em', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {label} {required && <span style={{ color: '#3b82f6' }}>*</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        tabIndex={0}
        onClick={() => !disabled && onChange && onChange(!checked)}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            onChange && onChange(!checked);
          }
        }}
        style={{
          width: 48,
          height: 28,
          borderRadius: 999,
          background: checked ? 'linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)' : '#23233a',
          border: '2px solid #23233a',
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.18s',
          outline: 'none',
          position: 'relative',
        }}
        aria-label={label}
        {...props}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: checked ? '#fff' : '#A0A0A0',
            boxShadow: checked ? '0 0 8px #3b82f6aa' : 'none',
            position: 'absolute',
            left: checked ? 22 : 2,
            top: 2,
            transition: 'left 0.18s',
            display: 'block',
          }}
        />
      </button>
    </div>
  );
}

export default Toggle; 