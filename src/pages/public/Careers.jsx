import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Compass, FileCheck2, Code, Terminal, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Careers = () => {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Engineering Roadmaps</p>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
            Career Pathways & Placement Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            A battle-tested blueprint for landing high-paying software engineering jobs and internships in 2026.
          </p>
        </div>

        {/* 4-Stage Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">CS Fundamentals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master Arrays, Trees, Dynamic Programming, and SQL. Spend 30 minutes daily solving structured medium-level algorithmic challenges.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/courses" className="text-xs font-semibold text-indigo-600 hover:underline">
                DSA Courses →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Build 2 Production Apps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never put tutorial clones on your CV. Build full-stack apps with authentication, relational databases (PostgreSQL/Supabase), and clean architecture.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/projects" className="text-xs font-semibold text-blue-600 hover:underline">
                View Capstones →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Targeted Internships</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apply to paid internships during pre-final or final semesters. Real production pull requests give you an unfair edge over pure academics.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/internships" className="text-xs font-semibold text-teal-600 hover:underline">
                Browse Internships →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              04
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Full-Time Placement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Convert internships into Pre-Placement Offers (PPO) or leverage our direct hiring drives with partnered product companies.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/jobs" className="text-xs font-semibold text-purple-600 hover:underline">
                Full-Time Jobs →
              </Link>
            </div>
          </div>
        </div>

        {/* Resume Checklist */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Placement Standard</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The 1-Page Engineering Resume Checklist
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Recruiters spend 6 seconds on initial screening. Make sure your resume follows the single-column ATS-compliant standard.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quantified impact: "Reduced API latency by 35% using Redis caching"</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hyperlinked live demo and GitHub repository for every project</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No self-assessed star ratings on skill lists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strictly 1-page PDF format with clean typography</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/student/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition"
              >
                <span>Upload & Verify Your Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Need a 1-on-1 Resume & Mock Interview Review?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book a targeted 45-minute session with verified senior engineers from Google, Amazon, and high-growth unicorn startups.
            </p>
            <Link
              to="/mentorship"
              className="block text-center py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Connect with a Mentor Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
