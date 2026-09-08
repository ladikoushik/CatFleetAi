import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/ui/RoleBadge';
import { User, ShieldCheck, Mail, Building, Phone, Key, CheckCircle2, Lock } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  const rolePermissions = {
    Admin: [
      'Full Fleet Asset Management (Create, Edit, Delete)',
      'Global Dealer & Branch Hub Administration',
      'System-Wide User & RBAC Management',
      'Financial Revenue Analytics & Export',
    ],
    Dealer_Manager: [
      'Regional Branch Fleet Allocation',
      'Customer Credit Limit & Contract Approvals',
      'Workshop Service & Maintenance Scheduling',
      'Regional Performance Analytics',
    ],
    Rental_Analyst: [
      'Fleet Utilization Analytics & Forecasting',
      'Machine Telemetry Diagnostic Monitoring',
      'Rental Pricing & Depreciation Reports',
      'Diagnostic Alert Auditing',
    ],
    Customer: [
      'Machine Fleet Catalog Browsing',
      'Rental Contract Booking Request',
      'Active Jobsite Machine Telemetry Tracking',
      'Billing & Invoice Records',
    ],
  };

  const activePermissions = rolePermissions[user?.role] || rolePermissions.Customer;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
          <User className="w-6 h-6 text-cat-yellow" />
          <span>User Profile & Security Control</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your enterprise credentials and role-based access entitlements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-cat-yellow text-cat-black font-black text-2xl flex items-center justify-center mb-4 shadow-cat-glow">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>

            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {user?.name || 'Alex Vance'}
              </h2>
              <RoleBadge role={user?.role || 'Admin'} />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {user?.companyName || 'Caterpillar Fleet HQ'}
            </p>

            <div className="divide-y divide-gray-100 dark:divide-cat-borderDark my-6 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-cat-yellow" />
                  <span>Email</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{user?.email || 'admin@catfleet.com'}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 flex items-center space-x-2">
                  <Building className="w-3.5 h-3.5 text-cat-yellow" />
                  <span>Organization</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{user?.companyName || 'Corporate HQ'}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 flex items-center space-x-2">
                  <Key className="w-3.5 h-3.5 text-cat-yellow" />
                  <span>JWT Auth Status</span>
                </span>
                <span className="font-bold text-emerald-400">Authenticated (7d)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RBAC Matrix Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cat-yellow" />
              <span>Role Entitlements Matrix: [{user?.role || 'Admin'}]</span>
            </h2>
            <RoleBadge role={user?.role || 'Admin'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePermissions.map((perm, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gray-50 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark flex items-start space-x-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{perm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
