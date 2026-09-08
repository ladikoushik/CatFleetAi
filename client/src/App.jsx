import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { AIInsights } from './pages/AIInsights';
import { FleetMap } from './pages/FleetMap';
import { Fleet } from './pages/Fleet';
import { MachineDetails } from './pages/MachineDetails';
import { Customers } from './pages/Customers';
import { Dealers } from './pages/Dealers';
import { Rentals } from './pages/Rentals';
import { Reports } from './pages/Reports';
import { QRScanner } from './pages/QRScanner';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TelemetryProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/fleet-map" element={<FleetMap />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/fleet/:id" element={<MachineDetails />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/dealers" element={<Dealers />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TelemetryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
