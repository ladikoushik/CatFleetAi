import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { RoleBadge } from '../ui/RoleBadge';
import { DEMO_USERS } from '../../services/api';
import {
  Sun,
  Moon,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldAlert,
  SlidersHorizontal,
  HardHat,
  Sparkles,
  Radio,
  X,
  Tractor,
  FileText,
  Building,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, loginAsRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const {
    machines,
    rentals,
    isDemoMode,
    setIsDemoMode,
    notifications,
    markAllNotificationsRead,
    setIsCopilotOpen,
  } = useTelemetry();

  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleRoleSwitch = (role) => {
    loginAsRole(role);
    setShowRoleMenu(false);
    navigate('/dashboard');
  };

  // Enterprise Global Search Filter Logic
  const matchingMachines = globalSearch.trim()
    ? machines.filter(
        (m) =>
          m.serialNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
          m.model.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const matchingRentals = globalSearch.trim()
    ? rentals.filter(
        (r) =>
          r.contractNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
          r.customerName.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-cat-black/90 backdrop-blur-md border-b border-gray-200 dark:border-cat-borderDark transition-colors">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-cat-card"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-cat-yellow flex items-center justify-center font-black text-cat-black shadow-cat-glow group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 text-cat-black" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-sans text-gray-900 dark:text-white">
                CAT <span className="text-cat-yellow">FleetBrain</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/30 rounded">
                AI PLATFORM
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Enterprise Global Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Enterprise Search: serial #, model, customer, contract..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-gray-100 dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-cat-yellow transition-colors font-medium"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {globalSearch.trim() && (
            <div className="absolute top-12 left-0 right-0 bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark rounded-xl shadow-2xl p-4 z-50 space-y-3 text-xs max-h-80 overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Matching Machinery</p>
                {matchingMachines.length > 0 ? (
                  matchingMachines.map((m) => (
                    <Link
                      key={m.serialNumber}
                      to="/fleet"
                      onClick={() => setGlobalSearch('')}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-cat-dark flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Tractor className="w-4 h-4 text-cat-yellow" />
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white">{m.model}</p>
                          <p className="text-[10px] font-mono text-gray-400">{m.serialNumber}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">{m.status}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-400">No machinery matching "{globalSearch}"</p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-cat-borderDark">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Matching Contracts</p>
                {matchingRentals.length > 0 ? (
                  matchingRentals.map((r) => (
                    <Link
                      key={r.contractNumber}
                      to="/rentals"
                      onClick={() => setGlobalSearch('')}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-cat-dark flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-cat-yellow" />
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white">{r.contractNumber}</p>
                          <p className="text-[10px] text-gray-400">{r.customerName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cat-yellow">${r.totalAmount.toLocaleString()}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-400">No contracts matching "{globalSearch}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-extrabold transition-all ${
              isDemoMode
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
            }`}
            title="Toggle Live Telemetry Simulation"
          >
            <Radio className={`w-3.5 h-3.5 ${isDemoMode ? 'animate-pulse' : ''}`} />
            <span>Demo Mode: {isDemoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* AI Copilot Launcher */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-all shadow-cat-glow"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (showNotifMenu) markAllNotificationsRead();
              }}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cat-card relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-cat-borderDark flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">Telemetry Alerts</span>
                  <button onClick={markAllNotificationsRead} className="text-[10px] text-cat-yellow font-bold hover:underline">
                    Mark Read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-cat-borderDark">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-cat-black/40 text-xs">
                      <p className="font-extrabold text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-xs font-medium hover:border-cat-yellow transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cat-yellow" />
              <span>Role:</span>
              <RoleBadge role={user?.role || 'Guest'} />
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-cat-borderDark mb-1">
                  Switch Role
                </div>
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => handleRoleSwitch(demo.role)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-100 dark:hover:bg-cat-borderDark/60 transition-colors ${
                      user?.role === demo.role ? 'bg-cat-yellow/10 font-bold text-cat-yellow' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span>{demo.name}</span>
                    <RoleBadge role={demo.role} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cat-card border border-transparent hover:border-gray-200 dark:hover:border-cat-borderDark transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-cat-yellow" /> : <Moon className="w-4 h-4 text-gray-700" />}
          </button>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-cat-card transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cat-yellow text-cat-black font-extrabold flex items-center justify-center text-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-cat-borderDark">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cat-borderDark/60"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-cat-yellow text-cat-black font-bold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
