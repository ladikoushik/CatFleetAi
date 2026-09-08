import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AICopilot } from '../ai/AICopilot';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles } from 'lucide-react';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsCopilotOpen } = useTelemetry();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-cat-dark text-gray-900 dark:text-gray-100 transition-colors relative">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating AI Copilot Assistant Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-cat-yellow text-cat-black font-extrabold shadow-cat-glow hover:bg-cat-yellowHover hover:scale-105 transition-all flex items-center space-x-2"
        title="Open CAT FleetBrain AI Copilot"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-xs hidden sm:inline">Ask CAT AI</span>
      </button>

      {/* AI Copilot Drawer */}
      <AICopilot />
    </div>
  );
};
