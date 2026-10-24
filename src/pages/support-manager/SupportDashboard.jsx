import React, { useState, useEffect } from 'react';
import { enquiryService, INQUIRY_CATEGORIES } from '../../services/enquiryService';
import { StatCard, StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  HelpCircle,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

export const SupportDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, categoryFilter, search]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiryService.getAllEnquiries({
        status: statusFilter,
        category: categoryFilter,
        search,
      });
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await enquiryService.updateStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      setNotification(`Enquiry status updated to "${newStatus}"!`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = enquiries.filter((e) => e.status === 'Pending').length;
  const inProgressCount = enquiries.filter((e) => e.status === 'In Progress').length;
  const resolvedCount = enquiries.filter((e) => e.status === 'Resolved').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Student Support & Enterprise Enquiries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Support Desk & Ticket Operations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor public contact inquiries, institutional bootcamp requests, and customer service follow-ups.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="font-bold underline text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries"
          value={enquiries.length}
          change="Received"
          icon={Mail}
          color="indigo"
        />
        <StatCard
          title="Pending Action"
          value={pendingCount}
          change="Awaiting first reply"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          change="Under investigation"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          change="Completed cases"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, college, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Inquiry Categories</option>
            {INQUIRY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6">Contact & Organization</th>
                <th className="py-3.5 px-4">Inquiry Category</th>
                <th className="py-3.5 px-4">Message / Scope</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-slate-900 text-sm">{enq.fullName}</div>
                    <div className="text-slate-500 text-[11px]">{enq.email} • {enq.phone}</div>
                    {enq.organization && (
                      <div className="text-indigo-600 font-medium text-[11px] mt-0.5">
                        {enq.organization}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {enq.inquiryType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-sm text-xs leading-relaxed">
                    "{enq.message}"
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">{enq.createdAt}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={enq.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
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
