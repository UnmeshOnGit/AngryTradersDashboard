
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { OrdersPage } from './pages/OrdersPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProInsightsPage } from './pages/ProInsightsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useApp();
  
  if (isLoading) return null; // Or a global loader
  if (!user) return <Navigate to="/login" replace />;
  
  return <MainLayout>{children}</MainLayout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
        <Route path="/markets/:assetId" element={<ProtectedRoute><AssetDetailPage /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/pro-insights" element={<ProtectedRoute><ProInsightsPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
