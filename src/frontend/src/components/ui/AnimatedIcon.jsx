import React from 'react';
import { motion } from 'framer-motion';

function AnimatedIcon({ icon: Icon, size = 32, color = '#3b82f6', animationType = 'hover', style = {}, ...props }) {
  const motionProps =
    animationType === 'loop'
      ? {
          animate: { rotate: [0, 360] },
          transition: { repeat: Infinity, duration: 2, ease: 'linear' },
        }
      : {
          whileHover: { scale: 1.18, rotate: 12, color },
          whileTap: { scale: 0.95 },
        };
  return (
    <motion.span
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, ...style }}
      {...motionProps}
      {...props}
    >
      {typeof Icon === 'function' ? <Icon width={size} height={size} color={color} /> : Icon}
    </motion.span>
  );
}

export default AnimatedIcon; 