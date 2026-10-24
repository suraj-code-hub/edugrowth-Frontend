import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import { Bookmark, Building2, MapPin, Trash2, ArrowRight } from 'lucide-react';

export const SavedOpportunities = () => {
  const { user, toggleSaveOpportunity } = useAuth();
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, [user]);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const allOpps = await jobService.getAllOpportunities();
      const savedIds = user?.savedOpportunityIds || [];
      const list = allOpps.filter((o) => savedIds.includes(o.id));
      setSavedList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Opportunities</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jobs and internships you have bookmarked for future application.
          </p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <span>Explore More Openings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : savedList.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved opportunities"
          description="Bookmark interesting roles from the Jobs or Internships pages to apply whenever you are ready."
          actionText="Find Jobs"
          onAction={() => window.location.assign('/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedList.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={opp.type} />
                    <span className="text-xs text-slate-400 font-medium">• {opp.workMode}</span>
                  </div>
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{opp.title}</h3>
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{opp.organization}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-normal">{opp.location}</span>
                </p>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{opp.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-indigo-700">{opp.salary}</span>
                <Link
                  to={opp.type === 'JOB' ? `/jobs/${opp.id}` : `/internships/${opp.id}`}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition"
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
