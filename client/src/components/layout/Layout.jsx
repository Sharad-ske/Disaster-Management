import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AlertBanner from '../common/AlertBanner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-darkNavy flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Topbar />
        <AlertBanner />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
