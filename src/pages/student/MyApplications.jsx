import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import { Briefcase, Building2, Calendar, FileText, ArrowRight } from 'lucide-react';

export const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      if (user?.email) {
        const data = await applicationService.getApplications({ applicantEmail: user.email });
        setApplications(data);
      }
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
          <h1 className="text-2xl font-bold text-slate-900">My Job & Internship Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime transparency on candidate screening, shortlist rounds, and technical interview stages.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/jobs"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Find Jobs
          </Link>
          <Link
            to="/internships"
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Find Internships
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications submitted yet"
          description="Explore our placement openings and submit your application with verified credentials."
          actionText="Explore Open Positions"
          onAction={() => window.location.assign('/jobs')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Responsive table for desktop & cards for mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Opportunity & Company</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Placement Feedback / Stage Notes</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 text-sm">{app.opportunityTitle}</div>
                      <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.organization}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {app.appliedDate}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs">
                      {app.notes || 'Under review by placement team.'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/jobs/${app.opportunityId}`}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
