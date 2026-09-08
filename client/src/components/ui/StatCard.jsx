import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, change, changeType, icon: Icon, description }) => {
  const isPositive = changeType === 'positive';
  const isNeutral = changeType === 'neutral';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm hover:border-cat-yellow/40 dark:hover:border-cat-yellow/40 transition-all relative overflow-hidden group"
    >
      {/* Subtle CAT Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cat-yellow via-amber-500 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-black mt-1 font-sans text-gray-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="p-3 rounded-lg bg-cat-yellow/10 dark:bg-cat-yellow/15 text-cat-yellow border border-cat-yellow/20">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : isNeutral
                  ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? '↑' : isNeutral ? '•' : '↓'} {change}
            </span>
          )}

          {description && (
            <span className="text-gray-500 dark:text-gray-400 truncate ml-2">
              {description}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
