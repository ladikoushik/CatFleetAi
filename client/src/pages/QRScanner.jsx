import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTelemetry } from '../context/TelemetryContext';
import { QrCode, CheckCircle2, RefreshCw, Tractor, ShieldCheck, ArrowRight, History } from 'lucide-react';

export const QRScanner = () => {
  const { machines, rentals, auditLogs, executeRentalStateTransition, addAuditLog } = useTelemetry();
  const [selectedMachine, setSelectedMachine] = useState(machines[0]?.serialNumber || 'CAT-336-EXC-901');
  const [scanned, setScanned] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('Hydraulic pressure checked. Track alignment verified OK.');

  const handleSimulateScan = () => {
    setScanned(true);

    // Find active rental associated with machine
    const matchingRental = rentals.find((r) => r.machineSerial === selectedMachine) || rentals[0];

    // Toggle rental lifecycle state & machine inventory status
    executeRentalStateTransition(matchingRental.contractNumber, 'Completed', {
      inspectionNotes,
      checkInTime: new Date().toLocaleString(),
    });

    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <QrCode className="w-6 h-6 text-cat-yellow" />
            <span>Equipment QR Check-In / Check-Out Lifecycle</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Scans automatically trigger inventory state transitions (`Available` ↔ `Rented` ↔ `Returned`) and append audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Scanner Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm text-center space-y-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Caterpillar Digital Equipment Pass Passcode</h2>

          <div className="p-6 rounded-2xl bg-cat-black border border-cat-borderDark inline-block shadow-2xl">
            <div className="w-48 h-48 bg-white p-3 rounded-xl flex items-center justify-center mx-auto shadow-cat-glow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-cat-black fill-current">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="70" y="0" width="30" height="30" />
                <rect x="0" y="70" width="30" height="30" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="10" y="40" width="15" height="15" />
                <rect x="70" y="40" width="20" height="10" />
              </svg>
            </div>
            <p className="text-xs font-mono text-cat-yellow font-extrabold mt-3">{selectedMachine}</p>
          </div>

          <div className="max-w-xs mx-auto space-y-3 text-xs text-left">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Select Caterpillar Machine</label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-cat-dark border border-gray-300 dark:border-cat-borderDark text-gray-900 dark:text-white font-medium"
              >
                {machines.map((m) => (
                  <option key={m.serialNumber} value={m.serialNumber}>
                    {m.model} ({m.serialNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1">Inspector Notes</label>
              <input
                type="text"
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-cat-dark border border-gray-300 dark:border-cat-borderDark text-gray-900 dark:text-white font-medium text-xs"
              />
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={scanned}
              className="w-full py-3 rounded-xl bg-cat-yellow text-cat-black font-extrabold hover:bg-cat-yellowHover transition-all shadow-cat-glow flex items-center justify-center space-x-2 mt-4"
            >
              <RefreshCw className={`w-4 h-4 ${scanned ? 'animate-spin' : ''}`} />
              <span>{scanned ? 'Executing State Transition...' : 'Execute QR Check-In / Check-Out'}</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Audit Log Stream */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <History className="w-5 h-5 text-emerald-400" />
              <span>Audit Log History Stream</span>
            </h2>
            <span className="text-xs font-mono text-gray-400 font-semibold">{auditLogs.length} Events</span>
          </div>

          <div className="space-y-3 text-xs max-h-[450px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-extrabold text-gray-900 dark:text-white">{log.action}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                    Entity: {log.entity} • User: {log.user} (IP: {log.ip})
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 shrink-0 ml-2">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
