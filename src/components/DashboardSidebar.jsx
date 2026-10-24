import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  FileText,
  User,
  Bookmark,
  GraduationCap,
  Users,
  Settings,
  HelpCircle,
  FolderGit2,
  DollarSign,
  Layers,
  Award,
  ChevronRight,
  ShieldAlert,
  X,
  FileCheck2,
} from 'lucide-react';

export const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const role = user?.role || ROLES.STUDENT;

  // Define role navigation menus
  const getNavItems = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { label: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Students & Users', path: '/admin/students', icon: Users },
          { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
          { label: 'Jobs & Internships', path: '/admin/opportunities', icon: Briefcase },
          { label: 'Applications Pool', path: '/admin/applications', icon: FileCheck2 },
          { label: 'Support Inquiries', path: '/admin/enquiries', icon: HelpCircle },
          { label: 'Finance & Revenue', path: '/admin/finance', icon: DollarSign },
          { label: 'Staff & Roles', path: '/admin/staff', icon: Settings },
        ];

      case ROLES.CONTENT_MANAGER:
        return [
          { label: 'Content Overview', path: '/content-manager/dashboard', icon: LayoutDashboard },
          { label: 'Courses & Lessons', path: '/content-manager/courses', icon: BookOpen },
          { label: 'Notes & Resources', path: '/content-manager/notes', icon: FileText },
          { label: 'Projects Showcase', path: '/content-manager/projects', icon: FolderGit2 },
        ];

      case ROLES.PLACEMENT_MANAGER:
        return [
          { label: 'Placements Overview', path: '/placement-manager/dashboard', icon: LayoutDashboard },
          { label: 'Active Openings', path: '/placement-manager/openings', icon: Briefcase },
          { label: 'Candidate Applications', path: '/placement-manager/applications', icon: FileCheck2 },
          { label: 'Interviews & Offers', path: '/placement-manager/interviews', icon: Award },
        ];

      case ROLES.SUPPORT_MANAGER:
        return [
          { label: 'Support Overview', path: '/support-manager/dashboard', icon: LayoutDashboard },
          { label: 'Contact Enquiries', path: '/support-manager/enquiries', icon: HelpCircle },
          { label: 'Service Inquiries', path: '/support-manager/services', icon: Layers },
        ];

      case ROLES.FINANCE_MANAGER:
        return [
          { label: 'Financial Overview', path: '/finance-manager/dashboard', icon: LayoutDashboard },
          { label: 'Transactions History', path: '/finance-manager/transactions', icon: DollarSign },
          { label: 'Course & Note Sales', path: '/finance-manager/reports', icon: FileText },
        ];

      case ROLES.STUDENT:
      default:
        return [
          { label: 'Dashboard Overview', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'My Enrolled Courses', path: '/student/courses', icon: BookOpen },
          { label: 'My Applications', path: '/student/applications', icon: Briefcase },
          { label: 'Saved Opportunities', path: '/student/saved', icon: Bookmark },
          { label: 'Notes & Cheatsheets', path: '/student/resources', icon: FileText },
          { label: 'My Resume & CV', path: '/student/resume', icon: FileCheck2 },
          { label: 'Student Profile', path: '/student/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">EduGrowth</span>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Indicator Banner */}
      <div className="p-4 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Role</p>
        </div>
        <p className="text-sm font-bold text-slate-900 mt-0.5">{role.replace('_', ' ')}</p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.fullName || 'Active User'}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick link back to public site */}
      <div className="p-4 border-t border-slate-200">
        <Link
          to="/"
          className="flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-50 transition"
        >
          <span>← Back to Public Website</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
