import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, ChevronUp, UserCheck, ArrowRight } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { user, switchRole, supabaseReady } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const roleConfigs = [
    { role: ROLES.STUDENT, label: 'Student', path: '/student/dashboard', desc: 'Learning, resume, applications & courses' },
    { role: ROLES.ADMIN, label: 'Admin', path: '/admin/dashboard', desc: 'Platform overview, staff, all students & analytics' },
    { role: ROLES.CONTENT_MANAGER, label: 'Content Manager', path: '/content-manager/dashboard', desc: 'Curriculum, notes & project portfolios' },
    { role: ROLES.PLACEMENT_MANAGER, label: 'Placement Manager', path: '/placement-manager/dashboard', desc: 'Jobs, internships & applicant shortlists' },
    { role: ROLES.SUPPORT_MANAGER, label: 'Support Manager', path: '/support-manager/dashboard', desc: 'Student inquiries & enterprise service requests' },
    { role: ROLES.FINANCE_MANAGER, label: 'Finance Manager', path: '/finance-manager/dashboard', desc: 'Revenue analytics, course & notes sales' },
  ];

  const handleSelectRole = (r, path) => {
    switchRole(r);
    navigate(path);
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 transition-all z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role Simulator:</span>
          </div>
          <span className="font-semibold text-white bg-indigo-950 border border-indigo-700/60 px-2 py-0.5 rounded text-[11px]">
            {user?.role || ROLES.STUDENT}
          </span>
          <span className="hidden sm:inline text-slate-400">({user?.fullName})</span>
          {supabaseReady ? (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Supabase Connected
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded" title="Supabase client ready; using responsive in-memory & localStorage storage until .env keys are added">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Supabase Client Ready (Local Mode)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden lg:flex items-center gap-1">
            {roleConfigs.map((item) => (
              <button
                key={item.role}
                onClick={() => handleSelectRole(item.role, item.path)}
                className={`px-2 py-1 rounded transition text-[11px] font-medium ${
                  user?.role === item.role
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition"
            aria-label="Toggle role switch drawer"
          >
            <span>Switch Role ({roleConfigs.length})</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Role Selection Drawer for small screens & full details */}
      {isOpen && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-slate-400 text-[11px] mb-2 font-medium">
              Select one of the 6 platform roles to test its dedicated permissions, dashboard layouts, and live functionality:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {roleConfigs.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    handleSelectRole(item.role, item.path);
                    setIsOpen(false);
                  }}
                  className={`text-left p-2.5 rounded-lg border transition ${
                    user?.role === item.role
                      ? 'bg-indigo-950/80 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-xs mb-0.5">
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
