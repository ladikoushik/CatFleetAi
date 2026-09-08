import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { apiFetch } from '../services/api';
import {
  Tractor,
  ArrowLeft,
  Activity,
  Fuel,
  Clock,
  Gauge,
  MapPin,
  Wrench,
  FileText,
  ShieldCheck,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export const MachineDetails = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState({
    id: id || 'm-1',
    serialNumber: 'CAT-336-EXC-901',
    model: 'Cat 336 Hydraulic Excavator',
    category: 'Excavators',
    year: 2024,
    dailyRate: 1450.00,
    hourlyRate: 185.00,
    monthlyRate: 28500.00,
    status: 'Rented',
    engineHours: 412,
    fuelLevel: 78,
    healthScore: 96,
    location: 'Metro Airport Expansion Site #4',
    latitude: 39.717,
    longitude: -86.294,
    specifications: {
      horsepower: '302 HP',
      operatingWeight: '37,200 kg',
      maxDigDepth: '8.2 m',
      bucketCapacity: '2.4 m3',
    },
    maintenances: [
      {
        id: 'maint-1',
        title: '500-Hour Hydraulic System & Engine Oil Service',
        scheduledDate: '2026-08-10',
        status: 'Scheduled',
        technician: 'Marcus Vance (Level 3 Certified)',
        cost: 850.00,
      },
    ],
    alerts: [
      {
        id: 'alt-1',
        urgency: 'Warning',
        code: 'WRN-FLT-104',
        title: 'Air Filter Restriction Near Limit',
        message: 'Engine air intake differential pressure reaching 82% threshold.',
      },
    ],
  });

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const data = await apiFetch(`/machines/${id}`);
        if (data) setMachine(data);
      } catch (err) {
        console.log('Using mock details for machine page');
      }
    };
    if (id) fetchMachineDetails();
  }, [id]);

  return (
    <Layout>
      {/* Back Link & Header */}
      <div className="mb-6">
        <Link
          to="/fleet"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-cat-yellow transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/30">
                {machine.category}
              </span>
              <StatusBadge status={machine.status} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white font-sans mt-1">
              {machine.model}
            </h1>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Serial PIN: {machine.serialNumber} • Model Year: {machine.year}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-right">
              <p className="text-[10px] text-gray-400">Rate Structure</p>
              <p className="text-sm font-black text-cat-yellow">${machine.dailyRate}/day (${machine.hourlyRate}/hr)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Gauge 1: Health Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-center flex flex-col items-center justify-center">
          <Activity className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Health Index</p>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{machine.healthScore}/100</h2>
          <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
            Optimal Operating Parameters
          </span>
        </div>

        {/* Gauge 2: Fuel Level */}
        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-center flex flex-col items-center justify-center">
          <Fuel className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fuel Tank Level</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{machine.fuelLevel}%</h2>
          <div className="w-full h-2 bg-gray-200 dark:bg-cat-dark rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${machine.fuelLevel}%` }} className="h-full bg-amber-400" />
          </div>
        </div>

        {/* Gauge 3: Engine Hours */}
        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-center flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-cat-yellow mb-2" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hour Meter</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{machine.engineHours} hrs</h2>
          <p className="text-[10px] text-gray-400 mt-2">Next service due at 500 hrs</p>
        </div>

        {/* Gauge 4: Hydraulic Pressure */}
        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark text-center flex flex-col items-center justify-center">
          <Gauge className="w-8 h-8 text-sky-400 mb-2" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hydraulic PSI</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">4,150 PSI</h2>
          <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-400">
            Nominal Pressure
          </span>
        </div>
      </div>

      {/* Deep Technical Specs & Telemetry Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Specifications Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-cat-yellow" />
            <span>Caterpillar Technical Specifications</span>
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-cat-borderDark text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Flywheel Horsepower</span>
              <span className="font-bold text-gray-900 dark:text-white">{machine.specifications?.horsepower || '302 HP'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Operating Weight</span>
              <span className="font-bold text-gray-900 dark:text-white">{machine.specifications?.operatingWeight || '37,200 kg'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Max Dig Depth</span>
              <span className="font-bold text-gray-900 dark:text-white">{machine.specifications?.maxDigDepth || '8.2 m'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Bucket Capacity</span>
              <span className="font-bold text-gray-900 dark:text-white">{machine.specifications?.bucketCapacity || '2.4 m3'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Grade Control Technology</span>
              <span className="font-bold text-cat-yellow">Cat Grade 3D Built-In</span>
            </div>
          </div>
        </div>

        {/* GPS Live Jobsite Location Mockup */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-cat-yellow" />
                <span>GPS Telemetry & Jobsite Tracking</span>
              </h2>
              <span className="text-xs font-mono text-gray-400">
                Lat: {machine.latitude || '39.717'}, Lng: {machine.longitude || '-86.294'}
              </span>
            </div>

            {/* Visual Simulated Map Card */}
            <div className="h-48 rounded-xl bg-cat-dark border border-cat-borderDark relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <div className="relative z-10 text-center space-y-2 p-4">
                <div className="w-12 h-12 rounded-full bg-cat-yellow/20 border-2 border-cat-yellow text-cat-yellow flex items-center justify-center mx-auto animate-pulse">
                  <Tractor className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-white">{machine.location}</p>
                <p className="text-[10px] text-gray-400">Geofence Status: Inside Active Jobsite Zone #4</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-cat-dark text-xs flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Connected Satellite:</span>
            <span className="font-bold text-emerald-400">Cat Product Link™ Dual Cellular/Sat</span>
          </div>
        </div>
      </div>

      {/* Maintenance & Diagnostics History */}
      <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
          <Wrench className="w-5 h-5 text-cat-yellow" />
          <span>Scheduled Service & Maintenance Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-cat-borderDark text-gray-400">
                <th className="pb-2 font-bold">Service Title</th>
                <th className="pb-2 font-bold">Scheduled Date</th>
                <th className="pb-2 font-bold">Technician</th>
                <th className="pb-2 font-bold">Est Cost</th>
                <th className="pb-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-cat-borderDark">
              {machine.maintenances && machine.maintenances.length > 0 ? (
                machine.maintenances.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 font-bold text-gray-900 dark:text-white">{m.title}</td>
                    <td className="py-3 text-gray-400">{m.scheduledDate}</td>
                    <td className="py-3 text-gray-300">{m.technician || 'Cat Certified Technician'}</td>
                    <td className="py-3 font-bold text-cat-yellow">${m.cost}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No open maintenance logs. Equipment is in prime operational condition!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
