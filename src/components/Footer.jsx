import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const Footer = () => {
  const isSupaConfigured = isSupabaseConfigured();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">EduGrowth</span>
            </Link>
            <p className="text-xl font-bold tracking-tight text-indigo-400">
              "Learn. Build. Share. Grow."
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering next-generation software engineers, creators, and leaders through practical curriculum, verified projects, real-world internships, and structured mentorship.
            </p>

            {/* Supabase status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupaConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {isSupaConfigured
                  ? 'Supabase Backend: Configured & Connected'
                  : 'Supabase Backend: Client Ready (Local Store Active)'}
              </span>
            </div>
          </div>

          {/* Column 1: Learn & Practice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Education & Code</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-indigo-400 transition">
                  Notes & Cheatsheets
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-indigo-400 transition">
                  Project Showcase
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="hover:text-indigo-400 transition">
                  1-on-1 Mentorship
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-indigo-400 transition">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Careers & Enterprise */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Placements & Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition">
                  Full-Time Jobs
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-indigo-400 transition">
                  Paid Internships
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-indigo-400 transition">
                  Career Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-indigo-400 transition">
                  Technology Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition">
                  College Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduGrowth Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-slate-400 transition">
              Help Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
