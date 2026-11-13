import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Scorecard } from './pages/Scorecard';
import { HCPInsights } from './pages/HCPInsights';
import { Calculator } from './pages/Calculator';
import { ActivityLog } from './pages/ActivityLog';
import { AuditExport } from './pages/AuditExport';
import { DataDispute } from './pages/DataDispute';
import { AIChat } from './components/AIChat';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-pharma-surface">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <AIChat />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Scorecard />} />
          <Route path="/insights" element={<HCPInsights />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/disputes" element={<DataDispute />} />
          <Route path="/audit" element={<AuditExport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;