import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat, AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-cat-dark text-white flex items-center justify-center p-4 selection:bg-cat-yellow selection:text-cat-black">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-6xl font-black text-cat-yellow font-sans tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-white mt-2">Telemetry Target Out of Range</h2>
        <p className="text-xs text-gray-400 mt-2">
          The fleet route or resource path you requested does not exist in the CAT FleetBrain directory.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-all shadow-cat-glow mt-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Fleet Control Tower</span>
        </Link>
      </div>
    </div>
  );
};
