import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-display font-semibold text-pharma-navy">{title}</h3>}
          {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};