import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HardHat, Lock, Mail, User, Building, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    role: 'Customer',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.companyName,
        formData.phone
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-cat-dark text-white flex items-center justify-center p-4 selection:bg-cat-yellow selection:text-cat-black">
      <div className="w-full max-w-md my-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cat-yellow flex items-center justify-center text-cat-black font-black shadow-cat-glow">
              <HardHat className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              CAT <span className="text-cat-yellow">FleetBrain</span> AI
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Create Real User Account & Access Enterprise Fleet
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-cat-black border border-cat-borderDark shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cat-yellow" />

          <h2 className="text-xl font-extrabold text-white mb-2">Create Real Account</h2>
          <p className="text-xs text-gray-400 mb-6">
            Register your credentials to access live Caterpillar equipment rentals.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Apex Infrastructure LLC"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 0199"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
              >
                <option value="Customer">Customer / Contractor</option>
                <option value="Dealer_Manager">Dealer Manager</option>
                <option value="Rental_Analyst">Rental Analyst</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <span>{loading ? 'Creating Real Account...' : 'Sign Up & Launch Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cat-yellow hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
