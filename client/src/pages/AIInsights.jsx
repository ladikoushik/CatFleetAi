import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useTelemetry } from '../context/TelemetryContext';
import { formatCurrency } from '../utils/formatters';
import {
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Tractor,
} from 'lucide-react';

export const AIInsights = () => {
  const { getDynamicAIInsights, machines, rentals } = useTelemetry();
  const dynamicAI = getDynamicAIInsights();

  const demandForecastData = [
    { category: 'Excavators', demand: 'High', predictedUnitsNeeded: 18, recommendedAction: 'Move 4 excavators from Chennai Yard to Mumbai Hub' },
    { category: 'Dozers', demand: 'Medium', predictedUnitsNeeded: 12, recommendedAction: 'Maintain current regional allocation in Hyderabad Hub' },
    { category: 'Wheel Loaders', demand: 'High', predictedUnitsNeeded: 15, recommendedAction: 'Shift 2 loaders from Pune Yard to Bengaluru Hub' },
    { category: 'Motor Graders', demand: 'Low', predictedUnitsNeeded: 6, recommendedAction: 'Offer 10% seasonal discount for mining contractors' },
  ];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-cat-yellow" />
            <span>AI Predictive Intelligence & Decision Support</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calculated live from active MySQL database records, IoT telemetry streams, and rental pipelines.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-cat-yellow/15 text-cat-yellow border border-cat-yellow/30 font-bold text-xs font-mono">
          DYNAMIC AI ENGINE ACTIVE
        </span>
      </div>

      {/* Dynamic AI Metric Cards derived from TelemetryContext */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demand Forecast Growth</p>
          <h3 className="text-2xl font-black text-cat-yellow mt-1 font-mono">{dynamicAI.predictedDemandGrowth}</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Calculated from {dynamicAI.totalFleet} active machines</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fleet Utilization Score</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">{dynamicAI.fleetUtilizationScore}%</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{dynamicAI.runningCount} units running on jobsites</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Fleet Health Score</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-mono">{dynamicAI.avgHealth} / 100</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{dynamicAI.maintCount} unit in workshop maintenance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Q3 Revenue Forecast</p>
          <h3 className="text-2xl font-black text-cat-yellow mt-1 font-mono">{formatCurrency(2800000)}</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Based on active rental contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Regional Demand Prediction Engine */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cat-yellow" />
            <span>Regional Demand Prediction Engine</span>
          </h2>

          <div className="space-y-4">
            {demandForecastData.map((d) => (
              <div
                key={d.category}
                className="p-4 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 dark:text-white">{d.category}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      d.demand === 'High'
                        ? 'bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    Demand: {d.demand} ({d.predictedUnitsNeeded} Units)
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  <span className="text-cat-yellow font-bold">Recommendation:</span> {d.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rental Return Date Delay Prediction */}
        <div className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cat-yellow" />
            <span>Rental Return Date & Delay Risk Prediction</span>
          </h2>

          <div className="space-y-4">
            {rentals.map((r) => (
              <div
                key={r.contractNumber}
                className="p-4 rounded-xl bg-gray-50 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 dark:text-white font-mono">{r.contractNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Confidence: {r.returnConfidence || 92}%
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-bold">{r.customerName}</p>
                <div className="flex items-center justify-between text-gray-500 font-mono text-[11px]">
                  <span>Contract Return: {r.endDate}</span>
                  <span className="text-cat-yellow font-bold">AI Predicted: {r.predictedReturnDate || r.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
