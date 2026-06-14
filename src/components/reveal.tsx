'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Reveal — a gentle fade + slide-up as the element scrolls into view.
 * Fast ease-out (≈300ms). Nothing snaps. Honors reduced-motion via CSS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
