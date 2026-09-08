import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-cat-borderDark py-4 px-6 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-cat-black/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cat-yellow" />
          <span className="font-bold text-gray-900 dark:text-white">
            CAT FleetBrain AI Platform
          </span>
          <span>© {new Date().getFullYear()} Caterpillar Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span>Enterprise Release v1.0.0</span>
          <span>•</span>
          <span className="text-emerald-500 font-medium">Sequelize REST Engine Online</span>
        </div>
      </div>
    </footer>
  );
};
