import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CURSOR_SIZE = 36;

function Cursor() {
  const cursorRef = useRef();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0.85);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX - CURSOR_SIZE / 2);
      y.set(e.clientY - CURSOR_SIZE / 2);
    };
    const down = () => scale.set(0.85);
    const up = () => scale.set(1);
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [x, y, scale]);

  return (
    <motion.div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        borderRadius: '50%',
        background: 'rgba(59,130,246,0.18)',
        border: '2.5px solid #3b82f6',
        boxShadow: '0 2px 16px #3b82f655',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'exclusion',
        backdropFilter: 'blur(2.5px)',
        willChange: 'transform, opacity',
        opacity,
        x: useSpring(x, { stiffness: 400, damping: 40 }),
        y: useSpring(y, { stiffness: 400, damping: 40 }),
        scale: useSpring(scale, { stiffness: 400, damping: 30 }),
        transition: 'background 0.18s, border 0.18s',
      }}
      aria-hidden="true"
    />
  );
}

export default Cursor; 