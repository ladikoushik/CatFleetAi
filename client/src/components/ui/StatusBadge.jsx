import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    // Machine status
    Available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Rented: 'bg-amber-500/15 text-cat-yellow border-amber-500/40 font-semibold',
    Maintenance: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    'In Transit': 'bg-sky-500/15 text-sky-400 border-sky-500/30',

    // Rental Contract Status
    Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Draft: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    Completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/30',

    // Diagnostic Alert Status
    Critical: 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse',
    Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Info: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  };

  const currentStyle = styles[status] || 'bg-gray-500/15 text-gray-300 border-gray-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};
