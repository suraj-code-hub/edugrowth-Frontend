import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  GraduationCap,
  FileText,
  User,
  LogOut,
  Sparkles,
  LayoutDashboard,
  FolderGit2,
  Users2,
  Wrench,
  HelpCircle,
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [careersDropdownOpen, setCareersDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case ROLES.ADMIN:
        return '/admin/dashboard';
      case ROLES.CONTENT_MANAGER:
        return '/content-manager/dashboard';
      case ROLES.PLACEMENT_MANAGER:
        return '/placement-manager/dashboard';
      case ROLES.SUPPORT_MANAGER:
        return '/support-manager/dashboard';
      case ROLES.FINANCE_MANAGER:
        return '/finance-manager/dashboard';
      case ROLES.STUDENT:
      default:
        return '/student/dashboard';
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-base font-medium px-3 py-2.5 rounded-lg ${
      isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                EduGrowth
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                Learn • Build • Share • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              Courses
            </NavLink>
            <NavLink to="/notes" className={navLinkClass}>
              Notes & Resources
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>

            {/* Careers Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCareersDropdownOpen(!careersDropdownOpen)}
                onBlur={() => setTimeout(() => setCareersDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
                aria-expanded={careersDropdownOpen}
              >
                <span>Careers</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {careersDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link
                    to="/jobs"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="font-medium">Full-Time Jobs</p>
                      <p className="text-xs text-slate-400">Software & Tech roles</p>
                    </div>
                  </Link>
                  <Link
                    to="/internships"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <GraduationCap className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="font-medium">Internships</p>
                      <p className="text-xs text-slate-400">Paid college opportunities</p>
                    </div>
                  </Link>
                  <Link
                    to="/mentorship"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <Users2 className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Mentorship</p>
                      <p className="text-xs text-slate-400">1-on-1 industry guidance</p>
                    </div>
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/careers"
                    className="block px-4 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Explore Career Roadmap & Guide →
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-xs transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user.fullName || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/student/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Student Profile</span>
                      </Link>
                      <Link
                        to="/student/applications"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>My Applications</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <Link
                to={getDashboardPath()}
                className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Courses
          </NavLink>
          <NavLink
            to="/notes"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Notes & Resources
          </NavLink>
          <NavLink
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Projects
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Jobs
          </NavLink>
          <NavLink
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Internships
          </NavLink>
          <NavLink
            to="/mentorship"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Mentorship
          </NavLink>
          <NavLink
            to="/careers"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Careers Guide
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Contact
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            About Us
          </NavLink>

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                      Role: {user.role}
                    </span>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
                  >
                    Go to Portal
                  </Link>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
