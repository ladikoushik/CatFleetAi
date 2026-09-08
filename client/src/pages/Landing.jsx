import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardHat,
  Tractor,
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  BarChart3,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_USERS } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { loginAsRole } = useAuth();

  return (
    <div className="min-h-screen bg-cat-dark text-white selection:bg-cat-yellow selection:text-cat-black">
      {/* Industrial Hero Banner Header */}
      <header className="border-b border-cat-borderDark bg-cat-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cat-yellow flex items-center justify-center text-cat-black font-black shadow-cat-glow">
              <HardHat className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              CAT <span className="text-cat-yellow">FleetBrain</span> AI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-gray-300 hover:text-cat-yellow transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow"
            >
              Launch Platform →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-cat-black via-cat-dark to-cat-dark">
        {/* Yellow Accent Glow Background Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cat-yellow/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cat-yellow/15 border border-cat-yellow/30 text-cat-yellow text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4" />
              <span>Next-Gen Enterprise Caterpillar Fleet Orchestration</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight font-sans">
              The AI-Powered Control Tower for <span className="text-cat-yellow">Heavy Fleet Rentals</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Real-time Caterpillar machine telemetry, automated rental agreements, predictive diagnostic alerts, and multi-dealer branch coordination in a single industrial platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-sm hover:bg-cat-yellowHover transition-all shadow-cat-glow flex items-center justify-center space-x-2"
              >
                <span>Enter Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cat-card border border-cat-borderDark text-white font-bold text-sm hover:border-cat-yellow transition-all flex items-center justify-center space-x-2"
              >
                <span>Test Role-Based Access</span>
              </Link>
            </div>
          </motion.div>

          {/* Quick Demo Role Switching Bar */}
          <div className="mt-16 p-6 rounded-2xl bg-cat-card/80 border border-cat-borderDark max-w-4xl mx-auto text-left shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Instant Persona Login (Select a Role to Explore)</span>
              <ShieldCheck className="w-4 h-4 text-cat-yellow" />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DEMO_USERS.map((demo) => (
                <Link
                  key={demo.role}
                  to="/dashboard"
                  onClick={() => loginAsRole(demo.role)}
                  className="p-3.5 rounded-xl bg-cat-black border border-cat-borderDark hover:border-cat-yellow transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${demo.badgeColor}`}>
                      {demo.role.replace('_', ' ')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cat-yellow group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs font-bold text-white mt-2 group-hover:text-cat-yellow transition-colors">{demo.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{demo.company}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 border-t border-cat-borderDark bg-cat-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
              Engineered for <span className="text-cat-yellow">Maximum Fleet ROI</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Built on enterprise REST architecture with Sequelize ORM and React Vite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-cat-card border border-cat-borderDark hover:border-cat-yellow/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cat-yellow/10 text-cat-yellow border border-cat-yellow/20 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">IoT Telemetry Diagnostics</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Track engine hours, fuel levels, GPS locations, and hydraulic pressure in real time for excavators, dozers, and wheel loaders.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-cat-card border border-cat-borderDark hover:border-cat-yellow/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cat-yellow/10 text-cat-yellow border border-cat-yellow/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Rental Lifecycle</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Streamline contract creation, hourly/daily/monthly rate calculation, branch inventory assignment, and machine status progression.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-cat-card border border-cat-borderDark hover:border-cat-yellow/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cat-yellow/10 text-cat-yellow border border-cat-yellow/20 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Dealer Coordination</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Connect regional dealership networks and branches with role-based permissions tailored for Admin, Dealer Managers, Analysts, and Customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-cat-borderDark text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Caterpillar Inc. CAT FleetBrain AI Enterprise Platform.</p>
      </footer>
    </div>
  );
};
