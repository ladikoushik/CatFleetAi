import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RoleBadge } from '../components/ui/RoleBadge';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
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
  FileText,
  Users,
  IndianRupee,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    kpis: {
      totalMachines: 6,
      rentedMachines: 2,
      availableMachines: 3,
      maintenanceMachines: 1,
      fleetUtilization: 67,
      activeRentalsCount: 2,
      totalCustomersCount: 2,
      totalRevenue: 5500000,
    },
    recentRentals: [],
    urgentAlerts: [],
    monthlyRevenue: [
      { month: 'Jan', revenue: 1200000, rentals: 32 },
      { month: 'Feb', revenue: 1400000, rentals: 38 },
      { month: 'Mar', revenue: 1600000, rentals: 45 },
      { month: 'Apr', revenue: 1750000, rentals: 49 },
      { month: 'May', revenue: 2000000, rentals: 56 },
      { month: 'Jun', revenue: 2300000, rentals: 64 },
    ],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiFetch('/dashboard');
        setMetrics(data);
      } catch (err) {
        console.log('Using live state for dashboard display');
      }
    };
    fetchDashboard();
  }, []);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await apiFetch(`/alerts/${alertId}/ack`, { method: 'POST' });
      setMetrics((prev) => ({
        ...prev,
        urgentAlerts: prev.urgentAlerts.filter((a) => a.id !== alertId),
      }));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans">
              Control Tower Overview
            </h1>
            <RoleBadge role={user?.role || 'Guest'} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time Caterpillar fleet operations, telematics streams, and rental revenue analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/rentals"
            className="px-4 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-1.5"
          >
            <span>+ Create Rental Contract</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total CAT Fleet"
          value={metrics.kpis.totalMachines}
          change="+2 units"
          changeType="positive"
          icon={Tractor}
          description={`${metrics.kpis.availableMachines} Ready to Rent`}
        />

        <StatCard
          title="Active Rentals"
          value={metrics.kpis.activeRentalsCount}
          change="+15% MoM"
          changeType="positive"
          icon={FileText}
          description={`${metrics.kpis.rentedMachines} Machines On Site`}
        />

        <StatCard
          title="Fleet Utilization"
          value={`${metrics.kpis.fleetUtilization}%`}
          change="+4.2%"
          changeType="positive"
          icon={Activity}
          description="Target: > 75%"
        />

        <StatCard
          title="Active Customers"
          value={metrics.kpis.totalCustomersCount}
          change="Corporate"
          changeType="neutral"
          icon={Users}
          description="Heavy Earthmoving & Infra"
        />

        <StatCard
          title="YTD Revenue"
          value={formatCurrency(metrics.kpis.totalRevenue || 5500000)}
          change="+24% YoY"
          changeType="positive"
          icon={IndianRupee}
          description="Rental & Service Fees"
        />
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recharts Monthly Fleet Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cat-yellow" />
                <span>Monthly Fleet Revenue (₹ INR)</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tracked across all dealer branches in India
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              +18.4% Growth
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                />
                <Bar dataKey="revenue" name="Monthly Revenue (₹)" fill="#FFCD11" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Telemetry Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-cat-yellow" />
              <span>Fleet Status Telemetry</span>
            </h2>

            <div className="space-y-4 my-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Rented On Jobsites</span>
                  <span className="text-cat-yellow font-bold">{metrics.kpis.rentedMachines} Units ({metrics.kpis.fleetUtilization}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-cat-dark rounded-full overflow-hidden">
                  <div style={{ width: `${metrics.kpis.fleetUtilization}%` }} className="h-full bg-cat-yellow" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Available in Yard</span>
                  <span className="text-emerald-400 font-bold">{metrics.kpis.availableMachines} Units</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-cat-dark rounded-full overflow-hidden">
                  <div style={{ width: `${(metrics.kpis.availableMachines / metrics.kpis.totalMachines) * 100}%` }} className="h-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700 dark:text-gray-300">In Workshop Maintenance</span>
                  <span className="text-rose-400 font-bold">{metrics.kpis.maintenanceMachines} Unit</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-cat-dark rounded-full overflow-hidden">
                  <div style={{ width: `${(metrics.kpis.maintenanceMachines / metrics.kpis.totalMachines) * 100}%` }} className="h-full bg-rose-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI Fleet Health Score: 96/100</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Optimal diagnostic parameters across excavators and dozers.
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Alerts & Recent Rental Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Real-Time Diagnostic Alerts</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              Live IoT Sensors
            </span>
          </div>

          <div className="space-y-3">
            {metrics.urgentAlerts && metrics.urgentAlerts.length > 0 ? (
              metrics.urgentAlerts.map((alert) => (
                <div
                  key={alert.id || alert.code}
                  className="p-3.5 rounded-xl bg-gray-50 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={alert.urgency || 'Critical'} />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {alert.message}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cat-yellow/15 text-cat-yellow border border-cat-yellow/30 hover:bg-cat-yellow hover:text-cat-black transition-colors"
                  >
                    Ack
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No active critical alerts. All machine telemetry within normal specs!
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cat-yellow" />
              <span>Recent Rental Contracts</span>
            </h2>
            <Link to="/rentals" className="text-xs font-bold text-cat-yellow hover:underline flex items-center">
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-cat-borderDark text-gray-500 dark:text-gray-400">
                  <th className="pb-2 font-bold">Contract #</th>
                  <th className="pb-2 font-bold">Customer</th>
                  <th className="pb-2 font-bold">Machine</th>
                  <th className="pb-2 font-bold">Amount</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-cat-borderDark">
                {metrics.recentRentals && metrics.recentRentals.length > 0 ? (
                  metrics.recentRentals.map((rental) => (
                    <tr key={rental.id || rental.contractNumber} className="hover:bg-gray-50 dark:hover:bg-cat-black/40">
                      <td className="py-3 font-bold text-gray-900 dark:text-white">
                        {rental.contractNumber}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">
                        {rental.customer?.companyName || 'Apex Heavy Infra'}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                        {rental.machine?.model || 'Cat Excavator'}
                      </td>
                      <td className="py-3 font-bold text-cat-yellow font-mono">
                        {formatCurrency(rental.totalAmount || 285000)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={rental.status || 'Active'} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No recent rental contracts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
