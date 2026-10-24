import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_JOBS_AND_INTERNSHIPS } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'edugrowth_opportunities';

const getLocalOpportunities = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_JOBS_AND_INTERNSHIPS));
  return INITIAL_JOBS_AND_INTERNSHIPS;
};

// Maps database job/internship rows to frontend opportunity model
const normalizeOpportunity = (row, type) => {
  if (!row) return null;
  const isJob = type === 'JOB' || row.job_type !== undefined;
  return {
    id: row.id,
    type: isJob ? 'JOB' : 'INTERNSHIP',
    title: row.title,
    organization: row.organization_name || row.organization,
    department: row.department || '',
    jobType: row.job_type || (isJob ? 'Full-Time' : 'Internship'),
    location: row.location,
    workMode: row.work_mode || row.workMode || 'Remote',
    experience: row.experience || (isJob ? '0-2 Years' : 'Fresher / Students'),
    salary: row.salary || (isJob ? 'Competitive CTC' : (row.stipend || 'Stipend provided')),
    stipend: row.stipend || (isJob ? undefined : '₹15,000 - ₹25,000 / month'),
    duration: row.duration || (isJob ? undefined : '3-6 Months'),
    deadline: row.deadline || '2026-12-31',
    skills: row.required_skills || row.skills || [],
    eligibility: row.eligibility || 'College Graduates & Final Year Students',
    openings: row.openings || 2,
    description: row.description || '',
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities
      : (row.responsibilities ? row.responsibilities.split(';').map(r => r.trim()) : [
          'Collaborate with product and engineering teams',
          'Write high quality maintainable code',
          'Participate in design and architectural discussions'
        ]),
    postedDate: row.created_at ? row.created_at.split('T')[0] : '2026-10-20',
    allowGuestApplications: Boolean(row.allow_guest_applications),
    status: row.status || 'published',
  };
};

export const jobService = {
  // Fetch all published jobs and internships
  async getAllOpportunities(filters = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const fetchJobs = filters.type !== 'INTERNSHIP';
        const fetchInternships = filters.type !== 'JOB';

        const promises = [];
        if (fetchJobs) {
          let jq = supabase.from('jobs').select('*');
          if (filters.status) jq = jq.eq('status', filters.status);
          else jq = jq.eq('status', 'published');
          if (filters.workMode && filters.workMode !== 'ALL') jq = jq.ilike('work_mode', `%${filters.workMode}%`);
          promises.push(jq.then(({ data }) => (data || []).map(r => normalizeOpportunity(r, 'JOB'))));
        } else {
          promises.push(Promise.resolve([]));
        }

        if (fetchInternships) {
          let iq = supabase.from('internships').select('*');
          if (filters.status) iq = iq.eq('status', filters.status);
          else iq = iq.eq('status', 'published');
          if (filters.workMode && filters.workMode !== 'ALL') iq = iq.ilike('work_mode', `%${filters.workMode}%`);
          promises.push(iq.then(({ data }) => (data || []).map(r => normalizeOpportunity(r, 'INTERNSHIP'))));
        } else {
          promises.push(Promise.resolve([]));
        }

        const [jobsList, internshipsList] = await Promise.all(promises);
        let combined = [...jobsList, ...internshipsList];

        if (combined.length > 0) {
          if (filters.search) {
            const q = filters.search.toLowerCase();
            combined = combined.filter(
              item =>
                item.title.toLowerCase().includes(q) ||
                item.organization.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q) ||
                (item.skills && item.skills.some(s => s.toLowerCase().includes(q)))
            );
          }
          return combined;
        }
      } catch (err) {
        console.warn('Supabase opportunities fetch error:', err);
      }
    }

    // Local fallback
    let list = getLocalOpportunities();
    if (filters.type && filters.type !== 'ALL') {
      list = list.filter((item) => item.type === filters.type);
    }
    if (filters.workMode && filters.workMode !== 'ALL') {
      list = list.filter((item) => item.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.organization.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (item.skills && item.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  // Get opportunity by ID
  async getOpportunityById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        // Try jobs first
        const { data: job } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
        if (job) return normalizeOpportunity(job, 'JOB');

        // Then try internships
        const { data: intern } = await supabase.from('internships').select('*').eq('id', id).maybeSingle();
        if (intern) return normalizeOpportunity(intern, 'INTERNSHIP');
      } catch (err) {
        console.warn('Supabase getOpportunityById error:', err);
      }
    }
    const items = getLocalOpportunities();
    return items.find((o) => o.id === id) || null;
  },

  // Create new opportunity (Placement Manager & Admin)
  async createOpportunity(itemData, creatorId = null) {
    const isJob = itemData.type === 'JOB';
    const tableName = isJob ? 'jobs' : 'internships';

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          title: itemData.title,
          organization_name: itemData.organization,
          location: itemData.location || 'Remote',
          work_mode: itemData.workMode || 'Remote',
          required_skills: Array.isArray(itemData.skills) ? itemData.skills : [],
          eligibility: itemData.eligibility,
          deadline: itemData.deadline || '2026-12-31',
          description: itemData.description,
          allow_guest_applications: Boolean(itemData.allowGuestApplications),
          status: itemData.status || 'published',
          created_by: creatorId,
        };

        if (isJob) {
          payload.job_type = itemData.jobType || 'Full-Time';
          payload.experience = itemData.experience || '0-2 Years';
          payload.responsibilities = Array.isArray(itemData.responsibilities)
            ? itemData.responsibilities.join('; ')
            : itemData.responsibilities;
        } else {
          payload.duration = itemData.duration || '6 Months';
          payload.stipend = itemData.stipend || '₹15,000 / month';
        }

        const { data, error } = await supabase.from(tableName).insert(payload).select().single();
        if (!error && data) {
          return normalizeOpportunity(data, itemData.type);
        }
      } catch (err) {
        console.warn('Supabase createOpportunity error:', err);
      }
    }

    const newOpp = {
      ...itemData,
      id: `opp-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      openings: Number(itemData.openings) || 1,
    };
    const current = getLocalOpportunities();
    const updated = [newOpp, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newOpp;
  },

  // Update existing opportunity
  async updateOpportunity(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const isJob = updates.type === 'JOB';
        const tableName = isJob ? 'jobs' : 'internships';
        const dbUpdates = {
          updated_at: new Date().toISOString(),
        };
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.organization) dbUpdates.organization_name = updates.organization;
        if (updates.location) dbUpdates.location = updates.location;
        if (updates.workMode) dbUpdates.work_mode = updates.workMode;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.deadline) dbUpdates.deadline = updates.deadline;

        const { data, error } = await supabase.from(tableName).update(dbUpdates).eq('id', id).select().single();
        if (!error && data) return normalizeOpportunity(data, updates.type);
      } catch (err) {
        console.warn('Supabase updateOpportunity error:', err);
      }
    }

    const current = getLocalOpportunities();
    const idx = current.findIndex((o) => o.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },

  // Save opportunity for student
  async saveOpportunity(studentId, oppId, type) {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        const isJob = type === 'JOB';
        await supabase.from('saved_opportunities').upsert({
          student_id: studentId,
          opportunity_type: isJob ? 'job' : 'internship',
          job_id: isJob ? oppId : null,
          internship_id: !isJob ? oppId : null,
        });
        return { success: true };
      } catch (err) {
        console.warn('Supabase saveOpportunity error:', err);
      }
    }
    return { success: true };
  },

  // Unsave opportunity
  async unsaveOpportunity(studentId, oppId) {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        await supabase
          .from('saved_opportunities')
          .delete()
          .eq('student_id', studentId)
          .or(`job_id.eq.${oppId},internship_id.eq.${oppId}`);
        return { success: true };
      } catch (err) {
        console.warn('Supabase unsaveOpportunity error:', err);
      }
    }
    return { success: true };
  },
};
