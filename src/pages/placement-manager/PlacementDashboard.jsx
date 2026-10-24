import React, { useState, useEffect } from 'react';
import { applicationService, APPLICATION_STATUSES } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { StatCard, StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  FileText,
  Building2,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const PlacementDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editingApp, setEditingApp] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadPlacementData();
  }, [selectedStatus, search]);

  const loadPlacementData = async () => {
    setLoading(true);
    try {
      const [apps, opps] = await Promise.all([
        applicationService.getApplications({ status: selectedStatus, search }),
        jobService.getAllOpportunities(),
      ]);
      setApplications(apps);
      setOpenings(opps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const updated = await applicationService.updateApplicationStatus(
        appId,
        newStatus,
        adminNote || `Moved to ${newStatus} stage by Placement Manager.`
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus, notes: updated.notes } : a))
      );
      setEditingApp(null);
      setAdminNote('');
      setNotification(`Candidate stage updated to "${newStatus}"!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Placement & Corporate Relations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Placement Manager Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review student applications, inspect resumes, advance candidate interview stages, and coordinate hiring partner selections.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="font-bold underline text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Openings"
          value={openings.length}
          change="Jobs & Internships"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Under Evaluation"
          value={applications.length}
          change="In active funnel"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Shortlisted Candidates"
          value={shortlistedCount}
          change="Portfolio screened"
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Final Offers / Selected"
          value={selectedCount}
          change="Hired this cohort"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidate name, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Stage Filter:</span>
          {['ALL', ...APPLICATION_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6">Candidate Details</th>
                <th className="py-3.5 px-4">College & Education</th>
                <th className="py-3.5 px-4">Opportunity</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Placement Notes</th>
                <th className="py-3.5 px-4 text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-slate-900 text-sm">{app.applicantName}</div>
                    <div className="text-slate-500 text-[11px]">{app.applicantEmail}</div>
                    <div className="text-slate-400 text-[11px]">{app.applicantPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    <span className="font-semibold block">{app.college}</span>
                    <span className="text-[11px] text-slate-400">
                      Resume: {app.resumeName || 'Candidate_Resume.pdf'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{app.opportunityTitle}</span>
                    <span className="text-xs text-slate-500">{app.organization}</span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-xs text-xs italic">
                    {app.notes || 'No remarks recorded.'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      >
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
