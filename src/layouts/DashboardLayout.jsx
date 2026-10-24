import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { RoleSwitcherBar } from '../components/RoleSwitcherBar';
import { Menu, Bell, User, LogOut, ArrowLeft } from 'lucide-react';

export const DashboardLayout = ({ allowedRoles = [] }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Route security check: verify if the current user has access to this dashboard
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <RoleSwitcherBar />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Dashboard Panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Dashboard Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                {user?.role ? `${user.role.replace('_', ' ')} Workspace` : 'Workspace'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Site</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
