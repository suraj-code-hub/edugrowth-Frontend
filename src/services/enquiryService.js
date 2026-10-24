import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_ENQUIRIES } from '../data/initialData';

const ENQUIRIES_KEY = 'edugrowth_enquiries';

const getLocalEnquiries = () => {
  const saved = localStorage.getItem(ENQUIRIES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(INITIAL_ENQUIRIES));
  return INITIAL_ENQUIRIES;
};

export const INQUIRY_CATEGORIES = [
  'Course or Training',
  'Internship',
  'Job or Career',
  'Mentorship',
  'Technology Services',
  'Business Development',
  'General Inquiry',
];

export const ENQUIRY_STATUSES = [
  'New',
  'Contacted',
  'Proposal',
  'In Progress',
  'Completed',
  'Cancelled',
];

const normalizeEnquiry = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    type: row.inquiry_type || (row.service_id ? 'Technology Services' : 'General Inquiry'),
    name: row.full_name || row.name,
    email: row.email,
    phone: row.phone,
    organization: row.organization_or_college || row.organization || '',
    message: row.message,
    status: row.status || 'New',
    submittedDate: row.created_at ? row.created_at.split('T')[0] : (row.submittedDate || '2026-10-23'),
  };
};

export const enquiryService = {
  // Fetch enquiries for Support Manager & Admin
  async getAllEnquiries(filter = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('contact_enquiries').select('*');
        if (filter.status && filter.status !== 'ALL') {
          query = query.eq('status', filter.status);
        }
        if (filter.category && filter.category !== 'ALL') {
          query = query.eq('inquiry_type', filter.category);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeEnquiry);
          if (filter.search) {
            const q = filter.search.toLowerCase();
            mapped = mapped.filter(
              (e) =>
                e.name.toLowerCase().includes(q) ||
                e.email.toLowerCase().includes(q) ||
                e.message.toLowerCase().includes(q)
            );
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getAllEnquiries error:', err);
      }
    }

    let enqs = getLocalEnquiries();
    if (filter.status && filter.status !== 'ALL') {
      enqs = enqs.filter((e) => e.status === filter.status);
    }
    if (filter.category && filter.category !== 'ALL') {
      enqs = enqs.filter((e) => e.type === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      enqs = enqs.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }
    return enqs;
  },

  // Submit general contact enquiry
  async submitContactEnquiry(enquiryData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          full_name: enquiryData.name || enquiryData.fullName,
          email: enquiryData.email,
          phone: enquiryData.phone,
          organization_or_college: enquiryData.organization || enquiryData.college || '',
          inquiry_type: enquiryData.type || enquiryData.category || 'General Inquiry',
          message: enquiryData.message,
          status: 'New',
        };

        const { data, error } = await supabase.from('contact_enquiries').insert(payload).select().single();
        if (!error && data) return normalizeEnquiry(data);
      } catch (err) {
        console.warn('Supabase submitContactEnquiry error:', err);
      }
    }

    const newEnq = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      status: 'New',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    const current = getLocalEnquiries();
    const updated = [newEnq, ...current];
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
    return newEnq;
  },

  // Submit service-specific enquiry
  async submitServiceEnquiry(serviceEnquiryData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          service_id: serviceEnquiryData.serviceId || null,
          service_name: serviceEnquiryData.serviceName || '',
          full_name: serviceEnquiryData.fullName || serviceEnquiryData.name,
          email: serviceEnquiryData.email,
          phone: serviceEnquiryData.phone,
          organization: serviceEnquiryData.organization || '',
          message: serviceEnquiryData.message,
          status: 'New',
        };

        const { data, error } = await supabase.from('service_enquiries').insert(payload).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase submitServiceEnquiry error:', err);
      }
    }
    return { success: true };
  },

  // Update status (Support Manager & Admin)
  async updateEnquiryStatus(id, newStatus, assignedStaffId = null) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_enquiries')
          .update({
            status: newStatus,
            assigned_staff_id: assignedStaffId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeEnquiry(data);
      } catch (err) {
        console.warn('Supabase updateEnquiryStatus error:', err);
      }
    }

    const current = getLocalEnquiries();
    const idx = current.findIndex((e) => e.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], status: newStatus };
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },
};
