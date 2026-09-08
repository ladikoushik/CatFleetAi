import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  MapPin,
  Tractor,
  FileText,
  Users,
  Building2,
  QrCode,
  User,
  Settings,
  Globe,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { RoleBadge } from '../ui/RoleBadge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isDemoMode } = useTelemetry();

  const navItems = [
    { label: 'Landing Page', path: '/', icon: Globe },
    { label: 'Control Tower', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Executive Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'AI Predictive Insights', path: '/ai-insights', icon: Sparkles },
    { label: 'Live Telematics Map', path: '/fleet-map', icon: MapPin },
    { label: 'Fleet Management', path: '/fleet', icon: Tractor },
    { label: 'Rental Contracts', path: '/rentals', icon: FileText },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Dealers & Branches', path: '/dealers', icon: Building2 },
    { label: 'Reports & BI', path: '/reports', icon: BarChart3 },
    { label: 'QR Check-In / Out', path: '/qr-scanner', icon: QrCode },
    { label: 'User Profile', path: '/profile', icon: User },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-cat-black border-r border-gray-200 dark:border-cat-borderDark flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Enterprise Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cat-yellow text-cat-black font-bold shadow-cat-glow'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cat-card hover:text-cat-black dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </NavLink>
            );
          })}
        </div>

        {/* Telemetry Status Box */}
        <div className="p-4 border-t border-gray-200 dark:border-cat-borderDark bg-gray-50 dark:bg-cat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-emerald-400 animate-ping' : 'bg-gray-400'}`} />
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                CAT Telemetry Link
              </span>
            </div>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Active User:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">{user?.name || 'Guest'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Role:</span>
              <RoleBadge role={user?.role || 'Guest'} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
