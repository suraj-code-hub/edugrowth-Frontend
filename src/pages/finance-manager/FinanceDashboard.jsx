import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { StatCard, StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';

export const FinanceDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    courseSalesTotal: 0,
    notesSalesTotal: 0,
    totalTransactions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'ALL', itemType: 'ALL', search: '' });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadFinanceData();
  }, [filter]);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const [txs, summary] = await Promise.all([
        financeService.getTransactions(filter),
        financeService.getFinancialMetrics(),
      ]);
      setTransactions(txs);
      setMetrics(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    setNotification('Exporting audited financial transactions report (CSV)...');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Financial Operations & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Finance & Revenue Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile payments, track course enrollments revenue, study notes purchases, and transaction histories.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Statement</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="font-bold underline text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-indigo-900 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Total Net Revenue</p>
          <p className="text-4xl font-black mt-2">₹{metrics.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-indigo-200 mt-2">
            From {metrics.successfulCount} settled client and student transactions
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Certifications</p>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">₹{metrics.courseSalesTotal.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Full-stack & cloud paid tracks</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resource Notes Sales</p>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">₹{metrics.notesSalesTotal.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">System design & algorithm handbooks</p>
        </div>
      </div>

      {/* Payment Health Stat Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-emerald-800">
          <p className="text-xs font-semibold uppercase tracking-wider">Settled & Successful</p>
          <p className="text-2xl font-black mt-1">{metrics.successfulCount}</p>
        </div>
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-amber-800">
          <p className="text-xs font-semibold uppercase tracking-wider">Pending Settlement</p>
          <p className="text-2xl font-black mt-1">{metrics.pendingCount}</p>
        </div>
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-rose-800">
          <p className="text-xs font-semibold uppercase tracking-wider">Failed / Timed Out</p>
          <p className="text-2xl font-black mt-1">{metrics.failedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, item, Tx ID..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <select
            value={filter.itemType}
            onChange={(e) => setFilter({ ...filter, itemType: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Item Categories</option>
            <option value="Course">Courses Only</option>
            <option value="Resource Note">Resource Notes Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                <th className="py-3.5 px-4">Student & Contact</th>
                <th className="py-3.5 px-4">Item Purchased</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Gateway Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {tx.id}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{tx.studentName}</span>
                    <span className="text-slate-400 text-[11px]">{tx.studentEmail}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    <span className="font-semibold block">{tx.itemTitle}</span>
                    <span className="text-[11px] text-indigo-600 font-medium">{tx.itemType}</span>
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900 text-sm">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{tx.paymentMethod}</td>
                  <td className="py-4 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-4 px-4 text-right">
                    <StatusBadge status={tx.status} />
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
