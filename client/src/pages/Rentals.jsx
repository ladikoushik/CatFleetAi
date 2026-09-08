import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Calendar,
  Building,
  Tractor,
} from 'lucide-react';

export const Rentals = () => {
  const { hasRole } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    machineId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    rateType: 'Monthly',
    rateValue: 285000,
    jobsiteLocation: 'Chennai Metro Project Site #2',
    operatorAssigned: 'Marcus Brody',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rData, cData, mData] = await Promise.all([
        apiFetch('/rentals').catch(() => []),
        apiFetch('/customers').catch(() => []),
        apiFetch('/machines').catch(() => []),
      ]);

      setRentals(Array.isArray(rData) ? rData : rData?.value || []);
      setCustomers(Array.isArray(cData) ? cData : cData?.value || []);
      setMachines(Array.isArray(mData) ? mData : mData?.value || []);
    } catch (err) {
      console.error('Failed to fetch rental records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRental = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const selectedMachineObj = machines.find((m) => String(m.id) === String(formData.machineId));
      const calculatedTotal = formData.rateType === 'Monthly' ? Number(formData.rateValue) : Number(formData.rateValue) * 30;

      await apiFetch('/rentals', {
        method: 'POST',
        body: JSON.stringify({
          customerId: formData.customerId,
          machineId: formData.machineId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          rateType: formData.rateType,
          rateValue: Number(formData.rateValue),
          totalAmount: calculatedTotal,
          jobsiteLocation: formData.jobsiteLocation,
          operatorAssigned: formData.operatorAssigned,
          status: 'Active',
        }),
      });

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      alert('Failed to create rental contract: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiFetch(`/rentals/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchData();
    } catch (err) {
      alert('Failed to update contract status: ' + err.message);
    }
  };

  const filteredRentals = rentals.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.contractNumber || '').toLowerCase().includes(q) ||
      (r.customer?.companyName || '').toLowerCase().includes(q) ||
      (r.machine?.model || '').toLowerCase().includes(q) ||
      (r.jobsiteLocation || '').toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cat-yellow" />
            <span>Caterpillar Rental Contracts</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Active equipment rental agreements, billing schedules, and contract lifecycles.
          </p>
        </div>

        {hasRole('Admin', 'Dealer_Manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rental Agreement</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contract #, customer, model, or jobsite location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-cat-yellow" />
            <p className="text-xs">Loading live rental contracts from MySQL database...</p>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500">
            No rental agreements found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-cat-borderDark text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-extrabold">Contract #</th>
                  <th className="pb-3 font-extrabold">Customer Account</th>
                  <th className="pb-3 font-extrabold">Equipment Model</th>
                  <th className="pb-3 font-extrabold">Rental Dates</th>
                  <th className="pb-3 font-extrabold">Billing Valuation</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-cat-borderDark font-medium">
                {filteredRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-cat-black/40">
                    <td className="py-3.5 font-bold font-mono text-gray-900 dark:text-white">
                      {r.contractNumber}
                    </td>
                    <td className="py-3.5 text-gray-700 dark:text-gray-300 font-bold">
                      {r.customer?.companyName || 'Apex Heavy Infra'}
                    </td>
                    <td className="py-3.5 text-gray-600 dark:text-gray-300">
                      {r.machine?.model || 'Cat Hydraulic Excavator'}
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-gray-500">
                      {r.startDate} → {r.endDate}
                    </td>
                    <td className="py-3.5 font-bold text-cat-yellow font-mono text-sm">
                      {formatCurrency(r.totalAmount || 285000)}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {r.status === 'Active' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] hover:bg-emerald-500 hover:text-white"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-cat-black border border-cat-borderDark p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-white mb-1">Create Caterpillar Rental Contract</h2>
            <p className="text-xs text-gray-400 mb-6">
              Contract data will be saved directly into `rental_db.Rentals`.
            </p>

            <form onSubmit={handleCreateRental} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Select Customer Account</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                >
                  <option value="">Choose Customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.contactPerson})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Select Equipment</label>
                <select
                  required
                  value={formData.machineId}
                  onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                >
                  <option value="">Choose Machinery...</option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.model} - {m.serialNumber} ({formatCurrency(m.monthlyRate)}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Billing Rate Type</label>
                  <select
                    value={formData.rateType}
                    onChange={(e) => setFormData({ ...formData, rateType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                  >
                    <option value="Monthly">Monthly Rate</option>
                    <option value="Daily">Daily Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Rate Value (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.rateValue}
                    onChange={(e) => setFormData({ ...formData, rateValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Jobsite Location</label>
                <input
                  type="text"
                  required
                  value={formData.jobsiteLocation}
                  onChange={(e) => setFormData({ ...formData, jobsiteLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold hover:bg-cat-yellowHover transition-all shadow-cat-glow mt-4 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Creating Agreement...' : 'Create Contract in MySQL'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
