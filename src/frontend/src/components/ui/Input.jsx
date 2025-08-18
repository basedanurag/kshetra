import React from 'react';
import { motion } from 'framer-motion';

function Input({
  label,
  error,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  ...props
}) {
  return (
    <div style={{ marginBottom: 22, width: '100%' }}>
      {label && (
        <label
          htmlFor={props.id}
          style={{
            display: 'block',
            marginBottom: 7,
            fontWeight: 600,
            color: error ? '#ef4444' : '#fff',
            fontFamily: 'Inter, DM Sans, sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '0.01em',
          }}
        >
          {label} {required && <span style={{ color: '#3b82f6' }}>*</span>}
        </label>
      )}
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        id={props.id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        whileFocus={{
          borderColor: error ? '#ef4444' : '#3b82f6',
          boxShadow: error
            ? '0 0 0 2px #ef444455'
            : '0 0 0 2px #3b82f655',
        }}
        animate={error ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px #ef444455' } : {}}
        transition={{ type: 'spring', stiffness: 320 }}
        style={{
          width: '100%',
          padding: '0.95rem 1.2rem',
          borderRadius: 10,
          border: `2px solid ${error ? '#ef4444' : '#23233a'}`,
          background: '#181a22',
          color: '#fff',
          fontSize: '1.08rem',
          fontFamily: 'Inter, DM Sans, sans-serif',
          outline: 'none',
          fontWeight: 500,
          boxShadow: error ? '0 0 0 2px #ef444455' : 'none',
          transition: 'border 0.18s, box-shadow 0.18s',
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <motion.div
          id={`${props.id}-error`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: '#ef4444', fontWeight: 500, fontSize: '0.98rem', marginTop: 6 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

export default Input; 