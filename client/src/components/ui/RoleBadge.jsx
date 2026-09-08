import React from 'react';

export const RoleBadge = ({ role }) => {
  const roleMap = {
    Admin: { label: 'Admin', style: 'bg-amber-500/20 text-cat-yellow border-amber-500/30' },
    Dealer_Manager: { label: 'Dealer Mgr', style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    Rental_Analyst: { label: 'Rental Analyst', style: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    Customer: { label: 'Customer', style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  };

  const current = roleMap[role] || { label: role, style: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${current.style}`}>
      {current.label}
    </span>
  );
};
