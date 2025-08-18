import React from 'react';
import { motion } from 'framer-motion';

function Radio({
  checked = false,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  name,
  value,
  id,
  ...props
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
      <motion.input
        id={id}
        type="radio"
        checked={checked}
        onChange={e => !disabled && onChange && onChange(e.target.value)}
        disabled={disabled}
        name={name}
        value={value}
        whileFocus={{ boxShadow: checked ? '0 0 0 2px #3b82f655' : '0 0 0 2px #23233a55' }}
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#3b82f6' : '#23233a'}`,
          background: checked ? 'linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)' : '#181a22',
          appearance: 'none',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border 0.18s, background 0.18s',
          position: 'relative',
        }}
        aria-checked={checked}
        aria-label={label}
        {...props}
      />
      <label htmlFor={id} style={{ fontWeight: 600, color: error ? '#ef4444' : '#fff', fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1.05rem', letterSpacing: '0.01em', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {label} {required && <span style={{ color: '#3b82f6' }}>*</span>}
      </label>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: '#ef4444', fontWeight: 500, fontSize: '0.98rem', marginLeft: 8 }}
        >
          {error}
        </motion.div>
      )}
      {/* Animated checkmark */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: checked ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: 'absolute',
          left: 8,
          top: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

export default Radio; 