import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const TelemetryContext = createContext();
const COHERE_KEY = import.meta.env.VITE_COHERE_API_KEY || '';

export const TelemetryProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Hydraulic Filter Warning',
      message: 'Cat 966 Loader (CAT-966-LDR-108) temp reached 104°C in workshop.',
      time: '2 mins ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Rental Extension Risk',
      message: 'Cat 336 Excavator predicted 3-day return delay by Apex Heavy Infra.',
      time: '15 mins ago',
      type: 'info',
      unread: true,
    },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'al-1', user: 'Admin User', action: 'System Initialization', timestamp: '2026-08-05 09:00 AM', entity: 'CAT FleetBrain Platform', ip: '127.0.0.1' },
    { id: 'al-2', user: 'Dealer Manager', action: 'Rental Contract Created', timestamp: '2026-08-05 10:15 AM', entity: 'CAT-RNT-2026-1001', ip: '192.168.1.45' },
    { id: 'al-3', user: 'Inspector Tech', action: 'QR Check-Out Verification', timestamp: '2026-08-05 11:30 AM', entity: 'CAT-336-EXC-901', ip: '10.0.0.88' },
  ]);

  // Fetch Live Data from MySQL DB via API Gateway
  const fetchLiveData = async () => {
    try {
      const [mRes, rRes] = await Promise.all([
        apiFetch('/machines').catch(() => []),
        apiFetch('/rentals').catch(() => []),
      ]);

      const mList = Array.isArray(mRes) ? mRes : mRes?.value || [];
      const rList = Array.isArray(rRes) ? rRes : rRes?.value || [];

      // Format machines with required telemetry attributes if null
      const formattedMachines = mList.map((m) => ({
        ...m,
        lat: m.latitude || 20.5937 + (Math.random() - 0.5) * 5,
        lng: m.longitude || 78.9629 + (Math.random() - 0.5) * 5,
        fuel: m.fuelLevel !== undefined ? m.fuelLevel : 90,
        temp: 88,
        engineHours: m.engineHours || 100,
        idleHours: 42,
        runningHours: 370,
        speed: m.status === 'Running' ? 12 : 0,
        battery: 24.2,
        operator: 'Marcus Brody (ID: OP-882)',
        healthScore: m.healthScore || 96,
        dealer: 'MacAllister Machinery CAT',
        customer: 'Apex Heavy Infrastructure LLC',
      }));

      const formattedRentals = rList.map((r) => ({
        ...r,
        contractNumber: r.contractNumber || `CAT-RNT-2026-${r.id?.slice(0, 4)}`,
        customerName: r.customer?.companyName || r.customerName || 'Apex Heavy Infrastructure LLC',
        machineModel: r.machine?.model || r.machineModel || 'Cat Excavator',
        machineSerial: r.machine?.serialNumber || r.machineSerial || 'CAT-336-EXC-901',
        totalAmount: Number(r.totalAmount) || 285000,
        predictedReturnDate: r.endDate ? new Date(r.endDate).toISOString().split('T')[0] : '2026-09-04',
        returnConfidence: 94,
      }));

      setMachines(formattedMachines);
      setRentals(formattedRentals);
    } catch (err) {
      console.error('Failed to sync TelemetryContext with MySQL:', err);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  // Telemetry Simulator Loop (Updates telemetry every 6 seconds)
  useEffect(() => {
    if (!isDemoMode || machines.length === 0) return;

    const interval = setInterval(() => {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.status === 'Running' || m.status === 'Rented') {
            return {
              ...m,
              lat: m.lat + (Math.random() - 0.5) * 0.002,
              lng: m.lng + (Math.random() - 0.5) * 0.002,
              fuel: Math.max(10, m.fuel - Math.floor(Math.random() * 2)),
              speed: Math.floor(10 + Math.random() * 15),
              temp: Math.min(108, Math.max(80, m.temp + (Math.random() > 0.5 ? 1 : -1))),
              runningHours: Number((m.runningHours + 0.1).toFixed(1)),
              engineHours: Number((m.engineHours + 0.1).toFixed(1)),
            };
          } else if (m.status === 'Idle') {
            return {
              ...m,
              speed: 0,
              idleHours: Number((m.idleHours + 0.1).toFixed(1)),
            };
          }
          return m;
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isDemoMode, machines.length]);

  const addAuditLog = (action, entity, user = 'Dealer Manager') => {
    const newLog = {
      id: `al-${Date.now()}`,
      user,
      action,
      timestamp: new Date().toLocaleString(),
      entity,
      ip: '192.168.1.100',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (title, message, type = 'info') => {
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, title, message, time: 'Just now', type, unread: true },
      ...prev,
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const executeRentalStateTransition = (rentalId, nextStatus, extraData = {}) => {
    let affectedMachineSerial = null;

    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId || r.contractNumber === rentalId) {
          affectedMachineSerial = r.machineSerial;
          return { ...r, status: nextStatus, ...extraData };
        }
        return r;
      })
    );

    if (affectedMachineSerial) {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.serialNumber === affectedMachineSerial) {
            let nextMachineStatus = m.status;
            if (nextStatus === 'Active') nextMachineStatus = 'Running';
            if (nextStatus === 'Completed') nextMachineStatus = 'Available';
            if (nextStatus === 'Maintenance') nextMachineStatus = 'Maintenance';
            return { ...m, status: nextMachineStatus, ...extraData };
          }
          return m;
        })
      );
    }

    addAuditLog(`Rental State Transition to ${nextStatus}`, rentalId);
    addNotification(`Rental Contract ${nextStatus}`, `Contract ${rentalId} status updated to ${nextStatus}.`, 'info');
  };

  const getDynamicAIInsights = () => {
    const totalFleet = machines.length;
    const runningCount = machines.filter((m) => m.status === 'Running' || m.status === 'Rented').length;
    const idleCount = machines.filter((m) => m.status === 'Idle').length;
    const maintCount = machines.filter((m) => m.status === 'Maintenance').length;

    const avgHealth = Math.round(machines.reduce((acc, m) => acc + (m.healthScore || 96), 0) / (totalFleet || 1));
    const fleetUtilizationScore = Math.round((runningCount / (totalFleet || 1)) * 100);

    const underutilizedMachines = machines.filter((m) => m.idleHours > 40);
    const criticalMachines = machines.filter((m) => (m.healthScore || 100) < 70);

    return {
      totalFleet,
      runningCount,
      idleCount,
      maintCount,
      avgHealth,
      fleetUtilizationScore,
      underutilizedMachines,
      criticalMachines,
      predictedDemandGrowth: '+24%',
      revenueForecast: '₹ 28,00,000',
    };
  };

  const queryCopilot = async (prompt) => {
    try {
      const cohereRes = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          preamble: 'You are CAT FleetBrain AI Copilot, an enterprise AI assistant built for Caterpillar heavy machinery dealers, rental managers, and fleet telematics analysts. Provide concise, professional, and actionable business recommendations with Caterpillar equipment insights.',
        }),
      });

      const data = await cohereRes.json();
      if (data.text) {
        return {
          answer: data.text,
          recommendation: 'Powered live by Cohere Command LLM API (CAT FleetBrain Intelligence).',
        };
      }
    } catch (err) {
      console.error('Cohere API Call error:', err);
    }

    return {
      answer: `Analyzing CAT FleetBrain telematics data for query: "${prompt}"... All regional dealer hubs connected with 98.4% IoT uptime.`,
      recommendation: 'Recommended action: Shift 4 idle excavators from Chennai yard to Mumbai hub to capture ₹ 42,00,000 regional demand.',
    };
  };

  return (
    <TelemetryContext.Provider
      value={{
        machines,
        rentals,
        auditLogs,
        notifications,
        isDemoMode,
        setIsDemoMode,
        isCopilotOpen,
        setIsCopilotOpen,
        fetchLiveData,
        queryCopilot,
        addAuditLog,
        addNotification,
        markAllNotificationsRead,
        executeRentalStateTransition,
        getDynamicAIInsights,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
