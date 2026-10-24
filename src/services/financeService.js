import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_TRANSACTIONS } from '../data/initialData';

const TRANSACTIONS_KEY = 'edugrowth_transactions';

const getLocalTransactions = () => {
  const saved = localStorage.getItem(TRANSACTIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  return INITIAL_TRANSACTIONS;
};

const normalizeTransaction = (row) => {
  if (!row) return null;
  return {
    id: row.provider_order_id || row.id,
    paymentId: row.id,
    studentName: row.profiles?.full_name || row.studentName || 'Student',
    studentEmail: row.profiles?.email || row.studentEmail || 'student@example.com',
    itemType: row.product_type === 'course' ? 'COURSE' : 'NOTES',
    itemTitle: row.verification_metadata?.itemTitle || row.itemTitle || (row.product_type === 'course' ? 'Premium Course Enrollment' : 'Technical Study Guide'),
    amount: Number(row.amount),
    currency: row.currency || 'INR',
    status: row.payment_status?.toUpperCase() || row.status?.toUpperCase() || 'SUCCESS',
    date: row.created_at ? row.created_at.split('T')[0] : (row.date || '2026-10-23'),
  };
};

export const financeService = {
  // Fetch transaction history
  async getTransactions(filter = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('payments').select('*, profiles (full_name, email)');

        if (filter.status && filter.status !== 'ALL') {
          query = query.eq('payment_status', filter.status.toLowerCase());
        }
        if (filter.itemType && filter.itemType !== 'ALL') {
          const type = filter.itemType === 'COURSE' ? 'course' : 'learning_resource';
          query = query.eq('product_type', type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeTransaction);
          if (filter.search) {
            const q = filter.search.toLowerCase();
            mapped = mapped.filter(
              (t) =>
                t.studentName.toLowerCase().includes(q) ||
                t.itemTitle.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
            );
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getTransactions error:', err);
      }
    }

    let txs = getLocalTransactions();
    if (filter.status && filter.status !== 'ALL') {
      txs = txs.filter((t) => t.status === filter.status);
    }
    if (filter.itemType && filter.itemType !== 'ALL') {
      txs = txs.filter((t) => t.itemType === filter.itemType);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.itemTitle.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return txs;
  },

  // Compute live financial analytics from actual database records
  async getFinancialStats() {
    const txs = await this.getTransactions();

    const successfulTxs = txs.filter((t) => t.status === 'SUCCESS' || t.status === 'SUCCESSFUL');
    const totalRevenue = successfulTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const successfulCount = successfulTxs.length;
    const pendingCount = txs.filter((t) => t.status === 'PENDING').length;
    const failedCount = txs.filter((t) => t.status === 'FAILED').length;

    const courseSales = txs.filter((t) => (t.itemType === 'COURSE' || t.product_type === 'course') && (t.status === 'SUCCESS' || t.status === 'SUCCESSFUL')).length;
    const notesSales = txs.filter((t) => (t.itemType === 'NOTES' || t.product_type === 'learning_resource') && (t.status === 'SUCCESS' || t.status === 'SUCCESSFUL')).length;

    return {
      totalRevenue,
      successfulCount,
      pendingCount,
      failedCount,
      courseSales,
      notesSales,
      totalTransactions: txs.length,
    };
  },

  async getFinancialMetrics() {
    return this.getFinancialStats();
  },
};
