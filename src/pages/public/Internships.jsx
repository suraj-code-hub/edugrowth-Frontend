import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  Search,
  GraduationCap,
  MapPin,
  Calendar,
  Bookmark,
  CheckCircle2,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Internships = () => {
  const { user, toggleSaveOpportunity } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    workMode: 'ALL',
  });

  useEffect(() => {
    loadInternships();
  }, [filters]);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllOpportunities({ ...filters, type: 'INTERNSHIP' });
      setInternships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Student & Fresher Programs</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Verified Paid Internships
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            Gain high-impact industry experience with guaranteed stipends, mentorship, and Pre-Placement Offer (PPO) pathways.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search internships by domain, college eligibility, tech..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={filters.workMode}
              onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-700"
            >
              <option value="ALL">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-2">Loading internships...</p>
          </div>
        ) : internships.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No internships match your filter"
            description="Clear your filter criteria or subscribe for new batch openings."
            actionText="Reset Filters"
            onAction={() => setFilters({ search: '', workMode: 'ALL' })}
          />
        ) : (
          <div className="space-y-4">
            {internships.map((intern) => {
              const isSaved = user?.savedOpportunityIds?.includes(intern.id);
              return (
                <div
                  key={intern.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="INTERNSHIP" />
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {intern.workMode}
                      </span>
                      <span className="text-xs text-slate-400">
                        Batch: {intern.eligibility || 'College Students'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {intern.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{intern.organization}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-normal text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {intern.location}
                        </span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {intern.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {intern.skills?.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Stipend */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-sm sm:text-base font-extrabold text-teal-700">
                        {intern.salary}
                      </span>
                      <p className="text-[11px] text-slate-400 flex items-center md:justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Apply before {intern.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleSaveOpportunity(intern.id)}
                        className={`p-2.5 rounded-xl border transition ${
                          isSaved
                            ? 'bg-teal-50 border-teal-200 text-teal-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Saved in My Opportunities' : 'Save for later'}
                        aria-label="Save internship"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <Link
                        to={`/internships/${intern.id}`}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition text-center"
                      >
                        View & Apply →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
