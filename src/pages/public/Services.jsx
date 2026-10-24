import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_SERVICES } from '../../data/initialData';
import {
  Globe,
  Code2,
  Cpu,
  Layers,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Services = () => {
  const iconMap = {
    Globe: Globe,
    Code2: Code2,
    Cpu: Cpu,
    Layers: Layers,
    GraduationCap: GraduationCap,
    TrendingUp: TrendingUp,
    BarChart3: BarChart3,
    Building2: Building2,
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technology & Institutional Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Comprehensive Technology & Business Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From high-performance software engineering to college placement partnerships and corporate bootcamp accelerators.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_SERVICES.map((srv) => {
            const Icon = iconMap[srv.icon] || Globe;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.details}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">Custom Scope</span>
                  <Link
                    to={`/contact?service=${encodeURIComponent(srv.title)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Collaboration Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              For Colleges, Universities & Enterprises
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Partner with EduGrowth for Placements & Tech Bootcamps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We collaborate with academic institutions to establish certified engineering excellence labs, student hackathons, and direct placement pipelines.
            </p>
          </div>

          <Link
            to="/contact?type=Industry%20Collaboration"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shrink-0 shadow-lg transition"
          >
            Initiate Institutional Partnership →
          </Link>
        </div>
      </div>
    </div>
  );
};
