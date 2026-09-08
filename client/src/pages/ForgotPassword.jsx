import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HardHat, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-cat-dark text-white flex items-center justify-center p-4 selection:bg-cat-yellow selection:text-cat-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cat-yellow flex items-center justify-center text-cat-black font-black shadow-cat-glow">
              <HardHat className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              CAT <span className="text-cat-yellow">FleetBrain</span> AI
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-2xl bg-cat-black border border-cat-borderDark shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cat-yellow" />

          <h2 className="text-xl font-extrabold text-white mb-2">Reset Password</h2>
          <p className="text-xs text-gray-400 mb-6">
            Enter your work email to receive password reset security link.
          </p>

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-300">
                A password reset token has been dispatched to <span className="font-bold text-white">{email}</span>.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-bold text-xs hover:bg-cat-yellowHover transition-colors mt-2"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:border-cat-yellow transition-colors font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-all shadow-cat-glow flex items-center justify-center space-x-2"
              >
                <span>Send Security Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-gray-400 mt-4">
                Remember your password?{' '}
                <Link to="/login" className="font-bold text-cat-yellow hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
