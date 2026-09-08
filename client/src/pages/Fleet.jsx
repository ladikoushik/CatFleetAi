import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
import { apiFetch } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Tractor,
  Plus,
  Search,
  Filter,
  Clock,
  X,
  Droplet,
  ShieldCheck,
  MapPin,
  Trash2,
  Loader2,
  BarChart3,
} from 'lucide-react';

export const Fleet = () => {
  const { hasRole } = useAuth();
  const { fetchLiveData } = useTelemetry();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serialNumber: '',
    model: '',
    category: 'Excavators',
    year: 2024,
    dailyRate: 14500,
    hourlyRate: 1850,
    monthlyRate: 285000,
    location: 'Chennai Main Fleet Yard',
    status: 'Available',
    engineHours: 50,
    fuelLevel: 100,
    healthScore: 98,
  });

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/machines');
      const list = Array.isArray(data) ? data : data?.value || [];
      setMachines(list);
      if (fetchLiveData) fetchLiveData();
    } catch (err) {
      console.error('Failed to fetch machines from MySQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await apiFetch('/machines', {
        method: 'POST',
        body: JSON.stringify({
          serialNumber: formData.serialNumber,
          model: formData.model,
          category: formData.category,
          year: Number(formData.year) || 2024,
          dailyRate: Number(formData.dailyRate),
          hourlyRate: Number(formData.hourlyRate),
          monthlyRate: Number(formData.monthlyRate),
          location: formData.location,
          status: formData.status,
          engineHours: Number(formData.engineHours) || 0,
          fuelLevel: Number(formData.fuelLevel) || 100,
          healthScore: Number(formData.healthScore) || 98,
        }),
      });

      setIsModalOpen(false);
      setFormData({
        serialNumber: '',
        model: '',
        category: 'Excavators',
        year: 2024,
        dailyRate: 14500,
        hourlyRate: 1850,
        monthlyRate: 285000,
        location: 'Chennai Main Fleet Yard',
        status: 'Available',
        engineHours: 50,
        fuelLevel: 100,
        healthScore: 98,
      });

      await fetchMachines();
    } catch (err) {
      alert('Failed to save machine to MySQL DB: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this Caterpillar equipment from MySQL inventory?')) {
      try {
        await apiFetch(`/machines/${id}`, { method: 'DELETE' });
        await fetchMachines();
      } catch (err) {
        alert('Failed to delete machine: ' + err.message);
      }
    }
  };

  const filtered = machines.filter((m) => {
    const matchSearch =
      (m.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.serialNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.location || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || m.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const rateChartData = machines.map((m) => ({
    model: m.model?.split(' ')[1] || m.serialNumber,
    daily: Number(m.dailyRate) || 0,
    monthly: Math.round((Number(m.monthlyRate) || 0) / 30),
  }));

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <Tractor className="w-6 h-6 text-cat-yellow" />
            <span>Caterpillar Equipment Fleet</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time MySQL machine inventory, telemetry, and rate control.
          </p>
        </div>

        {hasRole('Admin', 'Dealer_Manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add CAT Equipment</span>
          </button>
        )}
      </div>

      {/* Fleet Rate Breakdown Chart */}
      {rateChartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm mb-8">
          <h2 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cat-yellow" />
            <span>Equipment Rental Rate Comparison (₹ INR / Day)</span>
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis dataKey="model" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Daily Rate']}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                />
                <Bar dataKey="daily" name="Daily Rate (₹)" fill="#FFCD11" radius={[4, 4, 0, 0]} />
                <Bar dataKey="monthly" name="Effective Daily Rate from Monthly (₹)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by model, serial #, or jobsite location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Excavators">Excavators</option>
            <option value="Dozers">Dozers</option>
            <option value="Wheel Loaders">Wheel Loaders</option>
            <option value="Motor Graders">Motor Graders</option>
            <option value="Articulated Trucks">Articulated Trucks</option>
            <option value="Generators">Generators</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-cat-yellow" />
          <p className="text-xs">Loading live fleet inventory from MySQL database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Tractor className="w-12 h-12 text-gray-600" />
          <p className="text-sm font-semibold">No equipment found in MySQL database</p>
        </div>
      ) : (
        /* Machine Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((machine) => (
            <div
              key={machine.id}
              className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm hover:border-cat-yellow/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-cat-yellow tracking-wider uppercase font-mono">
                      {machine.serialNumber}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-sans mt-0.5">
                      {machine.model}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {machine.category} • Year {machine.year}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      machine.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : machine.status === 'Rented'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {machine.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 dark:bg-cat-black/60 border border-gray-100 dark:border-cat-borderDark mb-4 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Daily</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white font-mono mt-0.5">
                      {formatCurrency(machine.dailyRate || 14500)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Hourly</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white font-mono mt-0.5">
                      {formatCurrency(machine.hourlyRate || 1850)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Monthly</p>
                    <p className="text-xs font-black text-cat-yellow font-mono mt-0.5">
                      {formatCurrency(machine.monthlyRate || 285000)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Engine Hours:</span>
                    </span>
                    <span className="font-bold font-mono">{machine.engineHours} hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-400">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Fuel Level:</span>
                    </span>
                    <span className="font-bold font-mono">{machine.fuelLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Health Score:</span>
                    </span>
                    <span className="font-bold font-mono text-emerald-400">{machine.healthScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-cat-borderDark">
                    <span className="flex items-center space-x-1.5 text-gray-400 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{machine.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              {hasRole('Admin', 'Dealer_Manager') && (
                <div className="pt-3 border-t border-gray-100 dark:border-cat-borderDark flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleDelete(machine.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Machine from MySQL"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Machine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-cat-black border border-cat-borderDark p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-white mb-1">Add CAT Equipment to MySQL</h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter machine details. Data will be saved directly into `fleet_db.Machines`.
            </p>

            <form onSubmit={handleAddMachine} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="CAT-797F-TRK-99"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Cat 797F Mining Truck"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  >
                    <option value="Excavators">Excavators</option>
                    <option value="Dozers">Dozers</option>
                    <option value="Wheel Loaders">Wheel Loaders</option>
                    <option value="Motor Graders">Motor Graders</option>
                    <option value="Articulated Trucks">Articulated Trucks</option>
                    <option value="Generators">Generators</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Hourly (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Monthly (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyRate}
                    onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Hub Location</label>
                <input
                  type="text"
                  required
                  placeholder="Chennai Main Rental Hub"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold hover:bg-cat-yellowHover transition-all shadow-cat-glow mt-4 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Saving to MySQL DB...' : 'Save Equipment to MySQL'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
