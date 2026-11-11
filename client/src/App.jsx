import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NetworkProvider } from './context/NetworkContext';
import Layout from './components/layout/Layout';

// Pages
import Overview from './pages/Overview';
import Topology from './pages/Topology';
import Alerts from './pages/Alerts';
import Incidents from './pages/Incidents';
import Hospitals from './pages/Hospitals';
import Shelters from './pages/Shelters';
import Responders from './pages/Responders';
import Monitoring from './pages/Monitoring';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <NetworkProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="topology" element={<Topology />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="hospitals" element={<Hospitals />} />
            <Route path="shelters" element={<Shelters />} />
            <Route path="responders" element={<Responders />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NetworkProvider>
  );
}
