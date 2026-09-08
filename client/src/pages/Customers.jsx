import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import {
  Users as UsersIcon,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';

export const Customers = () => {
  const { hasRole } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    creditLimit: 250000,
    city: 'Indianapolis',
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/customers');
      if (Array.isArray(data)) {
        setCustomers(data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          creditLimit: Number(formData.creditLimit),
          city: formData.city,
        }),
      });

      setIsModalOpen(false);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        creditLimit: 250000,
        city: 'Indianapolis',
      });

      await fetchCustomers(); // Refresh directly from MySQL DB!
    } catch (err) {
      alert('Failed to save customer account to MySQL DB: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      (c.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.contactName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <UsersIcon className="w-6 h-6 text-cat-yellow" />
            <span>Corporate Customer Directory</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time MySQL customer accounts, credit evaluations, and rental history.
          </p>
        </div>

        {hasRole('Admin', 'Dealer_Manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Account</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company name, contact, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-100 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark text-gray-900 dark:text-white focus:outline-none focus:border-cat-yellow"
          />
        </div>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-cat-yellow" />
          <p className="text-xs">Loading live customer accounts from MySQL database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm hover:border-cat-yellow/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cat-yellow/10 text-cat-yellow border border-cat-yellow/20 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                        {customer.companyName}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {customer.contactName}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {customer.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{customer.city}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-cat-borderDark flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-semibold">Credit Limit:</span>
                <span className="text-xs font-black text-cat-yellow font-mono">
                  ${Number(customer.creditLimit || 250000).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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

            <h2 className="text-lg font-extrabold text-white mb-1">Add Customer Account to MySQL</h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter corporate account details. Data will be saved in `crm_db.Customers`.
            </p>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Heavy Infrastructure LLC"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="David Miller"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="customer@catfleet.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (708) 555-0144"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="Indianapolis"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Credit Limit ($)</label>
                <input
                  type="number"
                  required
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-cat-card border border-cat-borderDark text-white focus:border-cat-yellow"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold hover:bg-cat-yellowHover transition-all shadow-cat-glow mt-4 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Saving Account to MySQL...' : 'Save Customer Account to MySQL'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
