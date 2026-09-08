import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTelemetry } from '../context/TelemetryContext';
import { exportElementToPDF, exportDataToCSV } from '../utils/pdfExport';
import {
  FileText,
  Download,
  Search,
  Filter,
  Printer,
  Eye,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';

export const Reports = () => {
  const { machines, rentals, auditLogs } = useTelemetry();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewReport, setPreviewReport] = useState(null);
  const [exportingTitle, setExportingTitle] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const reportsList = [
    { id: 'rep-1', title: 'Fleet Utilization & Deployment Report', category: 'Operations', recordsCount: machines.length, description: 'Engine hours, idle %, and jobsite location analysis across active Caterpillar inventory.', data: machines },
    { id: 'rep-2', title: 'Revenue & Rental Rate Breakdown Report', category: 'Finance', recordsCount: rentals.length, description: 'Monthly vs Daily rate earnings, active contract valuation, and revenue forecasts.', data: rentals },
    { id: 'rep-3', title: 'Idle Machinery & Relocation Audit', category: 'Operations', recordsCount: machines.filter(m => m.idleHours > 40).length, description: 'Identifies machines with >40 idle hours per week for relocation to high-demand branch yards.', data: machines.filter(m => m.idleHours > 40) },
    { id: 'rep-4', title: 'Machine Health & Workshop Maintenance Log', category: 'Workshop', recordsCount: machines.filter(m => m.status === 'Maintenance').length, description: 'IoT diagnostic alert records, fluid pressure logs, and scheduled service histories.', data: machines.filter(m => m.status === 'Maintenance') },
    { id: 'rep-5', title: 'Cryptographic Audit Log Logbook', category: 'Security', recordsCount: auditLogs.length, description: 'Digital records of user state transitions, QR check-ins, and contract approvals.', data: auditLogs },
  ];

  const filteredReports = reportsList.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleExportPDF = async (rep) => {
    try {
      setExportingTitle(rep.title);
      setPreviewReport(rep);

      setTimeout(async () => {
        const cleanName = rep.title.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = await exportElementToPDF('reports-pdf-preview-content', `CAT_FleetBrainAI_Report_${cleanName}`);
        setToastMsg(`PDF exported successfully: ${filename}`);
        setExportingTitle(null);
        setTimeout(() => setToastMsg(null), 4000);
      }, 500);
    } catch (err) {
      alert('Unable to generate PDF: ' + err.message);
      setExportingTitle(null);
    }
  };

  const handleExportCSV = (rep) => {
    const cleanName = rep.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CAT_FleetBrainAI_Report_${cleanName}_${new Date().toISOString().split('T')[0]}.csv`;
    exportDataToCSV(rep.data, filename);
    setToastMsg(`CSV exported successfully: ${filename}`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handlePrint = (title) => {
    window.print();
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
            <FileText className="w-6 h-6 text-cat-yellow" />
            <span>Enterprise Business Intelligence & Reports</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Dynamic business reporting generated directly from live MySQL database records and telemetry logs.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search report title, domain, or parameters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cat-yellow font-medium"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-cat-yellow"
          >
            <option value="All">All Categories</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Workshop">Workshop</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cat-yellow/15 text-cat-yellow border border-cat-yellow/30">
                  {rep.category}
                </span>
                <span className="text-[11px] font-mono text-gray-400 font-semibold">{rep.recordsCount} Records</span>
              </div>

              <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-1.5">{rep.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{rep.description}</p>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 dark:border-cat-borderDark flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-cat-black text-gray-700 dark:text-gray-200 font-bold text-xs hover:border-cat-yellow border border-gray-200 dark:border-cat-borderDark transition-colors flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handlePrint(rep.title)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-cat-black text-gray-700 dark:text-gray-200 font-bold text-xs hover:border-cat-yellow border border-gray-200 dark:border-cat-borderDark transition-colors flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExportCSV(rep)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-cat-dark text-gray-900 dark:text-white font-bold text-xs hover:border-cat-yellow border border-gray-200 dark:border-cat-borderDark transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={() => handleExportPDF(rep)}
                  disabled={exportingTitle === rep.title}
                  className="px-3 py-1.5 rounded-lg bg-cat-yellow text-cat-black font-extrabold text-xs hover:bg-cat-yellowHover transition-colors shadow-cat-glow flex items-center space-x-1"
                >
                  {exportingTitle === rep.title ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{exportingTitle === rep.title ? 'Generating...' : 'PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Report Preview Modal & PDF Capture Element */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-cat-black border border-cat-borderDark p-6 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setPreviewReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="reports-pdf-preview-content" className="p-4 bg-cat-black text-white rounded-xl">
              <div className="flex items-center justify-between border-b border-cat-borderDark pb-3 mb-4">
                <div>
                  <span className="text-cat-yellow font-black text-base">CAT FleetBrain AI</span>
                  <h2 className="text-base font-extrabold text-white">{previewReport.title}</h2>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Date: {new Date().toLocaleDateString()}</span>
              </div>

              <div className="space-y-3 text-xs mb-4">
                {previewReport.data && previewReport.data.length > 0 ? (
                  previewReport.data.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-cat-card border border-cat-borderDark flex items-center justify-between font-mono">
                      <div>
                        <p className="font-extrabold text-white">{item.model || item.contractNumber || item.action || 'Record'}</p>
                        <p className="text-[10px] text-gray-400">{item.serialNumber || item.customerName || item.entity}</p>
                      </div>
                      <span className="text-cat-yellow font-bold text-xs">{item.status || item.amount || item.user}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No records found for this report filter.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cat-borderDark">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 rounded-xl bg-cat-yellow text-cat-black font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
