// src/components/common/AnimatedFade.jsx
import React from 'react';
import { motion } from 'framer-motion';
/**
 * Simple fade‑in animation used across the app.
 * Subtle transition: opacity from 0→1 and slight upward movement.
 * Props are forwarded to the underlying <motion.div> so callers can customize.
 */
const AnimatedFade = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export default AnimatedFade;
