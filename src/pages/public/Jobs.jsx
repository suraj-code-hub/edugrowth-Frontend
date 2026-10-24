import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  Bookmark,
  CheckCircle2,
  DollarSign,
  Building2,
  Clock,
} from 'lucide-react';

export const Jobs = () => {
  const { user, toggleSaveOpportunity } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    workMode: 'ALL',
  });

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllOpportunities({ ...filters, type: 'JOB' });
      setJobs(data);
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
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Full-Time Opportunities</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Software Engineering Jobs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            Vetted junior and mid-level software roles from high-growth engineering teams. Apply with your verified portfolio and resume.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by job title, company, skills..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={filters.workMode}
              onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            >
              <option value="ALL">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-2">Loading job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job listings found"
            description="Try modifying your keyword search or check back soon as new roles are posted weekly."
            actionText="Clear Filters"
            onAction={() => setFilters({ search: '', workMode: 'ALL' })}
          />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isSaved = user?.savedOpportunityIds?.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="JOB" />
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {job.workMode}
                      </span>
                      <span className="text-xs text-slate-400">
                        Posted {job.postedDate}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{job.organization}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-normal text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                        </span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {job.skills?.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Salary */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-sm sm:text-base font-extrabold text-indigo-700">
                        {job.salary}
                      </span>
                      <p className="text-[11px] text-slate-400 flex items-center md:justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Apply before {job.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleSaveOpportunity(job.id)}
                        className={`p-2.5 rounded-xl border transition ${
                          isSaved
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Saved in My Opportunities' : 'Save for later'}
                        aria-label="Save opportunity"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition text-center"
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
