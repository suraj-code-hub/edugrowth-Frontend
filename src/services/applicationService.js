import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_APPLICATIONS } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'edugrowth_applications';

const getLocalApplications = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
};

export const APPLICATION_STATUSES = [
  'Applied',
  'Reviewing',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
  'Completed',
];

const normalizeApplication = (row) => {
  if (!row) return null;
  const opp = row.jobs || row.internships || {};
  return {
    id: row.id,
    studentId: row.student_id,
    opportunityId: row.job_id || row.internship_id || row.opportunityId,
    opportunityType: row.opportunity_type?.toUpperCase() || row.opportunityType || 'JOB',
    opportunityTitle: opp.title || row.opportunityTitle || 'Software Engineering Role',
    organization: opp.organization_name || row.organization || 'Tech Company',
    applicantName: row.full_name || row.applicantName,
    applicantEmail: row.email || row.applicantEmail,
    applicantPhone: row.phone || row.applicantPhone,
    city: row.city || '',
    college: row.college || '',
    degree: row.degree || '',
    graduationYear: row.graduation_year || '',
    resumeUrl: row.resume_storage_path || row.resumeUrl || '',
    skills: row.skills || [],
    experience: row.experience || '',
    linkedin: row.linkedin_url || row.linkedin || '',
    github: row.github_url || row.github || '',
    availability: row.availability || '',
    coverLetter: row.cover_letter || '',
    status: row.status || 'Applied',
    notes: row.admin_notes || row.notes || 'Application received and under review.',
    appliedDate: row.created_at ? row.created_at.split('T')[0] : (row.appliedDate || '2026-10-22'),
  };
};

export const applicationService = {
  // Fetch candidate applications
  async getApplications(filter = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('applications').select(`
          *,
          jobs (title, organization_name),
          internships (title, organization_name)
        `);

        if (filter.studentId) {
          query = query.eq('student_id', filter.studentId);
        }
        if (filter.applicantEmail) {
          query = query.eq('email', filter.applicantEmail);
        }
        if (filter.status && filter.status !== 'ALL') {
          query = query.eq('status', filter.status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeApplication);
          if (filter.search) {
            const q = filter.search.toLowerCase();
            mapped = mapped.filter(
              (a) =>
                a.applicantName.toLowerCase().includes(q) ||
                a.opportunityTitle.toLowerCase().includes(q) ||
                a.organization.toLowerCase().includes(q)
            );
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getApplications error:', err);
      }
    }

    let apps = getLocalApplications();
    if (filter.applicantEmail) {
      apps = apps.filter((a) => a.applicantEmail.toLowerCase() === filter.applicantEmail.toLowerCase());
    }
    if (filter.status && filter.status !== 'ALL') {
      apps = apps.filter((a) => a.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.applicantName.toLowerCase().includes(q) ||
          a.opportunityTitle.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q)
      );
    }
    return apps;
  },

  // Submit job or internship application with duplicate prevention
  async submitApplication(applicationData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const isJob = applicationData.opportunityType === 'JOB';
        const oppId = applicationData.opportunityId;

        // Duplicate check if authenticated student
        if (applicationData.studentId) {
          const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('student_id', applicationData.studentId)
            .eq(isJob ? 'job_id' : 'internship_id', oppId)
            .maybeSingle();

          if (existing) {
            throw new Error('You have already applied for this opportunity.');
          }
        }

        const payload = {
          student_id: applicationData.studentId || null,
          opportunity_type: isJob ? 'job' : 'internship',
          job_id: isJob ? oppId : null,
          internship_id: !isJob ? oppId : null,
          full_name: applicationData.applicantName || applicationData.fullName,
          email: applicationData.applicantEmail || applicationData.email,
          phone: applicationData.applicantPhone || applicationData.phone,
          city: applicationData.city || '',
          college: applicationData.college || '',
          degree: applicationData.degree || '',
          graduation_year: applicationData.graduationYear || '',
          resume_storage_path: applicationData.resumeUrl || applicationData.resumeFileName || 'student-files/default_resume.pdf',
          skills: Array.isArray(applicationData.skills) ? applicationData.skills : [],
          experience: applicationData.experience || '',
          linkedin_url: applicationData.linkedin || '',
          github_url: applicationData.github || '',
          availability: applicationData.availability || '',
          cover_letter: applicationData.coverLetter || '',
          status: 'Applied',
        };

        const { data, error } = await supabase.from('applications').insert(payload).select().single();
        if (error) throw error;
        if (data) return normalizeApplication(data);
      } catch (err) {
        if (err.message?.includes('already applied')) {
          throw err;
        }
        console.warn('Supabase application submission error:', err);
      }
    }

    const newApp = {
      ...applicationData,
      id: `app-${Date.now()}`,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: 'Application received and queued for review.',
    };
    const current = getLocalApplications();
    const updated = [newApp, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newApp;
  },

  // Update application status (Placement Manager & Admin)
  async updateApplicationStatus(id, newStatus, adminNotes = '', reviewerId = null) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({
            status: newStatus,
            reviewed_by: reviewerId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeApplication(data);
      } catch (err) {
        console.warn('Supabase updateApplicationStatus error:', err);
      }
    }

    const current = getLocalApplications();
    const idx = current.findIndex((a) => a.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        status: newStatus,
        notes: adminNotes || current[idx].notes,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },
};
