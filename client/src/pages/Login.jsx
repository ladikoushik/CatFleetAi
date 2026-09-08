import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HardHat, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@catfleet.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-cat-dark text-white flex items-center justify-center p-4 selection:bg-cat-yellow selection:text-cat-black">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cat-yellow flex items-center justify-center text-cat-black font-black shadow-cat-glow group-hover:scale-105 transition-transform">
              <HardHat className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              CAT <span className="text-cat-yellow">FleetBrain</span> AI
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Enterprise Heavy Equipment Rental Portal & Telemetry Hub
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-cat-black border border-cat-borderDark shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cat-yellow" />

          <h2 className="text-xl font-extrabold text-white mb-2">Real User Sign-In</h2>
          <p className="text-xs text-gray-400 mb-6">
            Enter your work email and password to authenticate.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@catfleet.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-cat-yellow hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-all shadow-cat-glow flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? 'Authenticating Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-cat-borderDark text-center text-xs text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-cat-yellow hover:underline">
              Create New Account (Sign Up)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
