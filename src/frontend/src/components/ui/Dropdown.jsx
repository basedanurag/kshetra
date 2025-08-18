import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  required = false,
  disabled = false,
  id,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();

  const handleSelect = (option) => {
    if (!disabled) {
      onChange && onChange(option.value);
      setOpen(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setOpen((o) => !o);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div style={{ marginBottom: 22, width: '100%', position: 'relative' }}>
      {label && (
        <label
          htmlFor={id}
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
      <motion.button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-dropdown-list`}
        disabled={disabled}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: '0.95rem 1.2rem',
          borderRadius: 10,
          border: `2px solid ${error ? '#ef4444' : open ? '#3b82f6' : '#23233a'}`,
          background: '#181a22',
          color: value ? '#fff' : '#A0A0A0',
          fontSize: '1.08rem',
          fontFamily: 'Inter, DM Sans, sans-serif',
          outline: 'none',
          fontWeight: 500,
          boxShadow: open ? '0 0 0 2px #3b82f655' : error ? '0 0 0 2px #ef444455' : 'none',
          transition: 'border 0.18s, box-shadow 0.18s',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          zIndex: 2,
        }}
        tabIndex={0}
        {...props}
      >
        <span>{options.find((opt) => opt.value === value)?.label || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          style={{ float: 'right', marginLeft: 12, display: 'inline-block', transition: 'transform 0.18s' }}
        >
          ▼
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-dropdown-list`}
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              width: '100%',
              background: 'linear-gradient(135deg, #23233a 80%, #3b82f6 100%)',
              borderRadius: 12,
              boxShadow: '0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6',
              zIndex: 10,
              padding: 0,
              margin: 0,
              listStyle: 'none',
              fontFamily: 'Inter, DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: '1.08rem',
              overflow: 'hidden',
            }}
          >
            {options.length === 0 && (
              <li style={{ color: '#A0A0A0', padding: '1rem 1.2rem' }}>No options</li>
            )}
            {options.map((opt) => (
              <motion.li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                tabIndex={0}
                whileHover={{ background: '#3b82f6', color: '#fff' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelect(opt);
                }}
                style={{
                  padding: '0.95rem 1.2rem',
                  cursor: 'pointer',
                  background: value === opt.value ? '#3b82f6' : 'none',
                  color: value === opt.value ? '#fff' : '#fff',
                  outline: 'none',
                  border: 'none',
                  fontWeight: value === opt.value ? 700 : 500,
                  fontSize: '1.08rem',
                  transition: 'background 0.18s, color 0.18s',
                }}
              >
                {opt.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && (
        <motion.div
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

export default Dropdown; 