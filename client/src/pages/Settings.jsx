import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Moon, Sun, Cpu, Bell, Key, Database, Check } from 'lucide-react';

export const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [telemetryInterval, setTelemetryInterval] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-cat-yellow" />
          <span>System & Telemetry Settings</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Configure Caterpillar Product Link™ telemetry polling rate, API keys, and theme settings.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Appearance Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Sun className="w-4 h-4 text-cat-yellow" />
            <span>Industrial UI Theme</span>
          </h2>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Active Theme Mode</p>
              <p className="text-gray-500 dark:text-gray-400">Switch between Caterpillar High-Contrast Dark Mode and Light Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark font-bold text-xs flex items-center space-x-2 hover:border-cat-yellow transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-cat-yellow" />
                  <span>Dark Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-gray-700" />
                  <span>Light Theme</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telemetry Polling Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cat-yellow" />
            <span>Product Link™ IoT Telemetry Interval</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Satellite Telemetry Refresh Frequency</label>
              <select
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark text-gray-900 dark:text-white font-medium"
              >
                <option value="1">1 Second (Real-Time Diagnostic Stream)</option>
                <option value="5">5 Seconds (Standard Fleet Operations)</option>
                <option value="30">30 Seconds (Low-Bandwidth Satellite Mode)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold shadow-cat-glow flex items-center space-x-1.5"
              >
                {saved ? <Check className="w-4 h-4" /> : null}
                <span>{saved ? 'Preferences Saved!' : 'Save System Configuration'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
