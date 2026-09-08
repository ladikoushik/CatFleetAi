import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTelemetry } from '../context/TelemetryContext';
import { exportElementToPDF } from '../utils/pdfExport';
import { formatCurrency } from '../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  Sparkles,
  Clock,
  Building,
  Loader2,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';

const CAT_COLORS = {
  yellow: '#FFCD11',
  black: '#1A1A1A',
  dark: '#2B2B2B',
  emerald: '#10B981',
  blue: '#3B82F6',
  rose: '#EF4444',
  amber: '#F59E0B',
  purple: '#8B5CF6',
};

const fleetUtilizationTrend = [
  { month: 'Sep', utilization: 62 },
  { month: 'Oct', utilization: 65 },
  { month: 'Nov', utilization: 68 },
  { month: 'Dec', utilization: 71 },
  { month: 'Jan', utilization: 64 },
  { month: 'Feb', utilization: 69 },
  { month: 'Mar', utilization: 74 },
  { month: 'Apr', utilization: 78 },
  { month: 'May', utilization: 82 },
  { month: 'Jun', utilization: 85 },
  { month: 'Jul', utilization: 81 },
  { month: 'Aug', utilization: 88 },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 1450000, target: 1400000 },
  { month: 'Feb', revenue: 1680000, target: 1550000 },
  { month: 'Mar', revenue: 1920000, target: 1800000 },
  { month: 'Apr', revenue: 2100000, target: 2000000 },
  { month: 'May', revenue: 2450000, target: 2200000 },
  { month: 'Jun', revenue: 2800000, target: 2500000 },
];

const machineTypeData = [
  { name: 'Excavators', value: 38, color: CAT_COLORS.yellow },
  { name: 'Dozers', value: 24, color: CAT_COLORS.emerald },
  { name: 'Wheel Loaders', value: 18, color: CAT_COLORS.blue },
  { name: 'Motor Graders', value: 12, color: CAT_COLORS.purple },
  { name: 'Articulated Trucks', value: 8, color: CAT_COLORS.amber },
];

const rentalStatusData = [
  { name: 'Running / Rented', value: 64, color: CAT_COLORS.emerald },
  { name: 'Available Yard', value: 22, color: CAT_COLORS.yellow },
  { name: 'Idle Site', value: 10, color: CAT_COLORS.amber },
  { name: 'Workshop Maintenance', value: 4, color: CAT_COLORS.rose },
];

const demandForecastData = [
  { category: 'Excavators', current: 32, predicted: 45 },
  { category: 'Dozers', current: 20, predicted: 28 },
  { category: 'Wheel Loaders', current: 15, predicted: 22 },
  { category: 'Motor Graders', current: 10, predicted: 14 },
  { category: 'Articulated Trucks', current: 8, predicted: 12 },
];

const machineHealthData = [
  { name: 'Excellent (90-100%)', value: 72, color: CAT_COLORS.emerald },
  { name: 'Good (75-89%)', value: 20, color: CAT_COLORS.yellow },
  { name: 'Warning (60-74%)', value: 6, color: CAT_COLORS.amber },
  { name: 'Critical (<60%)', value: 2, color: CAT_COLORS.rose },
];

const topIdleMachines = [
  { name: 'CAT-D6-DOZ-402', idleHours: 84, recommendation: 'Relocate to South Texas Hub' },
  { name: 'CAT-966-LDR-108', idleHours: 62, recommendation: 'Offer 15% discount for quarry client' },
  { name: 'CAT-14M-GRD-550', idleHours: 45, recommendation: 'Schedule workshop inspection' },
  { name: 'CAT-745-TRK-009', idleHours: 38, recommendation: 'Reallocate to highway project' },
];

const dealerPerformanceData = [
  { dealer: 'MacAllister CAT', revenue: 1850000, utilization: 84 },
  { dealer: 'HOLT CAT Texas', revenue: 2400000, utilization: 91 },
  { dealer: 'Paterson CAT West', revenue: 1650000, utilization: 76 },
  { dealer: 'Ziegler CAT North', revenue: 1300000, utilization: 72 },
];

export const Analytics = () => {
  const [exporting, setExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const filename = await exportElementToPDF('executive-analytics-content', 'CAT_FleetBrainAI_Executive_Report');
      setToastMsg(`PDF exported successfully: ${filename}`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      alert('Unable to generate PDF: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Layout>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cat-yellow" />
            <span>Caterpillar Executive Analytics & BI Dashboard</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Presentation-ready fleet utilization, regional demand forecasting, revenue insights, and AI diagnostics.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="px-4 py-2.5 rounded-xl bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-2 w-fit"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{exporting ? 'Generating Executive PDF...' : 'Download PDF Report'}</span>
        </button>
      </div>

      {/* Capture Area for PDF Export */}
      <div id="executive-analytics-content" className="p-4 bg-white dark:bg-cat-dark rounded-2xl">
        {/* Company Header Branding */}
        <div className="p-4 rounded-xl bg-cat-black text-white border border-cat-borderDark mb-6 flex items-center justify-between">
          <div>
            <span className="text-cat-yellow font-black text-lg">CAT FleetBrain AI</span>
            <p className="text-[11px] text-gray-400 font-mono">Enterprise Fleet Operations Executive Report</p>
          </div>
          <span className="text-[10px] font-mono text-gray-400">Date: {new Date().toLocaleDateString()}</span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Machinery</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5 font-mono">102 Units</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Fleet Utilization</p>
            <h3 className="text-xl font-black text-cat-yellow mt-0.5 font-mono">88.4%</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Active Rentals</p>
            <h3 className="text-xl font-black text-emerald-400 mt-0.5 font-mono">64 Active</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Monthly Revenue</p>
            <h3 className="text-xl font-black text-cat-yellow mt-0.5 font-mono">{formatCurrency(2800000)}</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Active Dealers</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5 font-mono">4 Franchises</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Health Score</p>
            <h3 className="text-xl font-black text-emerald-400 mt-0.5 font-mono">96 / 100</h3>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cat-yellow" />
              <span>1. Fleet Utilization Trend % (12 Months)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fleetUtilizationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} domain={[50, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }} />
                  <Line type="monotone" dataKey="utilization" stroke="#FFCD11" strokeWidth={3} dot={{ fill: '#FFCD11' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-cat-yellow" />
              <span>2. Monthly Rental Revenue (₹ INR) vs Target</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Actual Revenue (₹)" fill="#FFCD11" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Revenue (₹)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Machine Distributions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-xs font-extrabold text-gray-900 dark:text-white mb-4">3. Machine Type Distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={machineTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {machineTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-xs font-extrabold text-gray-900 dark:text-white mb-4">4. Rental Status Breakdown</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rentalStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {rentalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-xs font-extrabold text-gray-900 dark:text-white mb-4">6. Machine Health Rating</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={machineHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {machineHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Demand Forecast & Dealer Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cat-yellow" />
              <span>5. AI Demand Forecast (Current vs Predicted Units)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis dataKey="category" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }} />
                  <Legend />
                  <Bar dataKey="current" name="Current Demand" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="AI Predicted Demand" fill="#FFCD11" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Building className="w-4 h-4 text-cat-yellow" />
              <span>9. Regional Dealer Franchise Revenue (₹ INR)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealerPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis dataKey="dealer" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Dealer Revenue']}
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                  />
                  <Bar dataKey="revenue" name="Dealer Revenue (₹)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Idle Machinery */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>8. Top Idle Machinery Analysis & Recommendations</span>
          </h3>
          <div className="space-y-3 text-xs">
            {topIdleMachines.map((m) => (
              <div key={m.name} className="p-3.5 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-gray-900 dark:text-white font-mono">{m.name}</span>
                  <span className="ml-3 font-bold text-amber-400">{m.idleHours} Idle Hours</span>
                </div>
                <span className="text-cat-yellow font-medium">Recommendation: {m.recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
