import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { enquiryService } from '../../services/enquiryService';
import { financeService } from '../../services/financeService';
import { StatCard, StatusBadge } from '../../components/CommonUI';
import {
  Users,
  BookOpen,
  Briefcase,
  HelpCircle,
  DollarSign,
  ShieldCheck,
  Activity,
  Layers,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 12480,
    activeStudents: 3820,
    courseCount: 0,
    oppCount: 0,
    appCount: 0,
    pendingEnquiries: 0,
    totalRevenue: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [staffList, setStaffList] = useState([
    { id: 'st-1', name: 'Dr. Rajesh Nair', email: 'rajesh.nair@edugrowth.edu', role: 'CONTENT_MANAGER', status: 'Active' },
    { id: 'st-2', name: 'Tanvi Saxena', email: 'tanvi.s@edugrowth.edu', role: 'PLACEMENT_MANAGER', status: 'Active' },
    { id: 'st-3', name: 'Manoj Kumar', email: 'manoj.k@edugrowth.edu', role: 'SUPPORT_MANAGER', status: 'Active' },
    { id: 'st-4', name: 'Sunil Rao', email: 'sunil.r@edugrowth.edu', role: 'FINANCE_MANAGER', status: 'Active' },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [courses, opps, apps, enquiries, finMetrics] = await Promise.all([
        courseService.getAllCourses(),
        jobService.getAllOpportunities(),
        applicationService.getApplications(),
        enquiryService.getAllEnquiries(),
        financeService.getFinancialMetrics(),
      ]);

      const pendingEnq = enquiries.filter((e) => e.status === 'Pending').length;

      setMetrics((prev) => ({
        ...prev,
        courseCount: courses.length,
        oppCount: opps.length,
        appCount: apps.length,
        pendingEnquiries: pendingEnq,
        totalRevenue: finMetrics.totalRevenue,
      }));

      setRecentApplications(apps.slice(0, 4));
      setRecentEnquiries(enquiries.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Super Administrator Command</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Platform Governance & Metrics Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enterprise oversight across enrolled students, courses, placements, financial transactions, and manager personnel.
        </p>
      </div>

      {/* Top 6 Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents.toLocaleString()}
          change={`${metrics.activeStudents.toLocaleString()} active daily`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Published Courses"
          value={metrics.courseCount}
          change="Curriculums live"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Placement Applications"
          value={metrics.appCount}
          change="Across all tracks"
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          title="Pending Enquiries"
          value={metrics.pendingEnquiries}
          change="Requires staff response"
          icon={HelpCircle}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">Total Platform Revenue</p>
            <p className="text-3xl font-black mt-1">₹{metrics.totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-1">From course sales, certification fees, and premium notes</p>
          </div>
          <DollarSign className="w-10 h-10 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Hiring Openings</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{metrics.oppCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Active full-time jobs and paid internships</p>
          </div>
          <Briefcase className="w-10 h-10 text-indigo-600 opacity-80" />
        </div>
      </div>

      {/* Grid: Staff Management & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff & Role Management */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Staff & Managers</h2>
              <p className="text-xs text-slate-500">RBAC role assignments across managers</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {staffList.length} Active Staff
            </span>
          </div>

          <div className="space-y-3">
            {staffList.map((st) => (
              <div
                key={st.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{st.name}</h4>
                  <p className="text-slate-400 text-[11px]">{st.email}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-700 block text-[11px]">{st.role}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">● {st.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Submissions</h2>
              <p className="text-xs text-slate-500">Latest students applying for jobs/internships</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{app.applicantName}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {app.opportunityTitle} • {app.organization}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Pending Institutional & Support Inquiries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {recentEnquiries.map((enq) => (
            <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{enq.fullName}</span>
                <StatusBadge status={enq.status} />
              </div>
              <p className="text-slate-500 text-[11px]">{enq.organization} • {enq.inquiryType}</p>
              <p className="text-slate-600 line-clamp-2 italic">"{enq.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
