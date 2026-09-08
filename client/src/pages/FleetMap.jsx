import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTelemetry } from '../context/TelemetryContext';
import {
  MapPin,
  Tractor,
  Activity,
  Droplet,
  Clock,
  Gauge,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Zap,
} from 'lucide-react';

export const FleetMap = () => {
  const { machines = [], isDemoMode } = useTelemetry();
  const [selectedMachine, setSelectedMachine] = useState(machines[0] || null);

  const activeMachine = selectedMachine || machines[0];

  const getStatusColor = (status, health) => {
    if (health && health < 60) return 'bg-rose-500 text-white border-rose-400';
    switch (status) {
      case 'Running':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'Idle':
        return 'bg-amber-500 text-white border-amber-400';
      case 'Maintenance':
        return 'bg-orange-500 text-white border-orange-400';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cat-yellow" />
            <span>Interactive Live Fleet Telematics Map</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time IoT satellite positioning, engine parameters, and diagnostic alerts across North America.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Satellite Feed Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Simulated Map Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Simulated Dark Mode Map Grid Background */}
          <div className="absolute inset-0 bg-cat-black opacity-90 border border-cat-borderDark rounded-2xl p-4 overflow-hidden">
            <div className="w-full h-full border border-dashed border-cat-borderDark/40 rounded-xl relative bg-[radial-gradient(#2B2B2B_1px,transparent_1px)] [background-size:24px_24px]">
              {/* Map Title Overlay */}
              <div className="absolute top-4 left-4 bg-cat-dark/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cat-borderDark text-[11px] font-mono text-cat-yellow font-extrabold flex items-center space-x-2 z-10">
                <Zap className="w-3.5 h-3.5" />
                <span>GPS GEOLOCATION STREAM (NORTH AMERICA HUB)</span>
              </div>

              {/* Machine Map Pin Markers */}
              {machines.map((m, idx) => {
                // Map lat/lng coordinates to relative positions
                const posX = 15 + ((m.lng + 120) / 40) * 70;
                const posY = 15 + ((50 - m.lat) / 30) * 70;

                return (
                  <button
                    key={m.serialNumber || idx}
                    onClick={() => setSelectedMachine(m)}
                    style={{ left: `${Math.min(85, Math.max(10, posX))}%`, top: `${Math.min(85, Math.max(10, posY))}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl border-2 shadow-2xl transition-all hover:scale-125 z-20 group ${
                      activeMachine?.serialNumber === m.serialNumber ? 'ring-4 ring-cat-yellow scale-110' : ''
                    } ${getStatusColor(m.status, m.healthScore)}`}
                  >
                    <Tractor className="w-5 h-5" />
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 bg-cat-black text-white text-[10px] font-extrabold px-2 py-0.5 rounded border border-cat-borderDark whitespace-nowrap hidden group-hover:block font-mono shadow-lg">
                      {m.serialNumber} ({m.status})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Legend */}
          <div className="relative z-10 mt-auto pt-4 flex flex-wrap items-center gap-4 bg-cat-dark/90 backdrop-blur-md p-3 rounded-xl border border-cat-borderDark text-xs font-bold text-white">
            <span className="text-gray-400 font-semibold text-[11px]">Legend:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Idle</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400">Critical Alert</span>
            </div>
          </div>
        </div>

        {/* Selected Machine Telemetry Inspector Drawer */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm space-y-6">
          {activeMachine ? (
            <>
              <div>
                <span className="text-[10px] font-extrabold font-mono text-cat-yellow uppercase tracking-wider">
                  {activeMachine.serialNumber}
                </span>
                <h2 className="text-lg font-black text-gray-900 dark:text-white font-sans mt-0.5">
                  {activeMachine.model}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Assigned Dealer: {activeMachine.dealer || 'MacAllister Machinery CAT'}
                </p>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Operating Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusColor(activeMachine.status, activeMachine.healthScore)}`}>
                  {activeMachine.status}
                </span>
              </div>

              {/* Live Telemetry Gauges Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark">
                  <div className="flex items-center space-x-1.5 text-gray-400 font-semibold mb-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-400" />
                    <span>Fuel Level</span>
                  </div>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono">{activeMachine.fuel}%</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark">
                  <div className="flex items-center space-x-1.5 text-gray-400 font-semibold mb-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engine Hours</span>
                  </div>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono">{activeMachine.engineHours} hrs</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark">
                  <div className="flex items-center space-x-1.5 text-gray-400 font-semibold mb-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fluid Temp</span>
                  </div>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono">{activeMachine.temp}°C</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark">
                  <div className="flex items-center space-x-1.5 text-gray-400 font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Health Score</span>
                  </div>
                  <p className="text-base font-black text-emerald-400 font-mono">{activeMachine.healthScore}/100</p>
                </div>
              </div>

              {/* Operator & Customer Details */}
              <div className="space-y-2 text-xs border-t border-gray-200 dark:border-cat-borderDark pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Assigned Operator:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{activeMachine.operator || 'Marcus Brody'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rented Customer:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{activeMachine.customer || 'Apex Heavy Infra'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-cat-yellow font-bold">
                    {activeMachine.lat?.toFixed(4)}, {activeMachine.lng?.toFixed(4)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-gray-400">Select a machine marker on the map to inspect live telematics.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};
