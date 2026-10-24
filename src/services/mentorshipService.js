import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const MENTOR_APPLICATIONS_KEY = 'edugrowth_mentor_applications';

const INITIAL_MENTOR_APPS = [
  {
    id: 'ment-1',
    name: 'Kavish Deshmukh',
    email: 'kavish.d@techscale.io',
    phone: '+91 9988776655',
    currentRole: 'Staff Software Engineer',
    organization: 'FinScale Technologies',
    skills: ['System Design', 'Go', 'Distributed Systems', 'Kubernetes'],
    experience: '8 Years',
    topics: ['System Design Interviews', 'Microservices', 'Career Growth'],
    linkedIn: 'https://linkedin.com/in/kavish-deshmukh',
    github: 'https://github.com/kavishd',
    reason: 'I want to give back to aspiring engineers and help college students master real-world distributed systems.',
    availability: 'Weekends (4-6 hours)',
    status: 'Approved',
    appliedDate: '2026-10-15',
  },
  {
    id: 'ment-2',
    name: 'Pooja Sen',
    email: 'pooja.sen@cloudmatrix.dev',
    phone: '+91 9876501234',
    currentRole: 'Senior Frontend Architect',
    organization: 'PixelScale Studio',
    skills: ['React', 'Next.js', 'Web Performance', 'Design Systems'],
    experience: '6 Years',
    topics: ['Frontend Architecture', 'Portfolio Review', 'Mock Interviews'],
    linkedIn: 'https://linkedin.com/in/pooja-sen',
    github: 'https://github.com/poojasen',
    reason: 'Passionate about mentoring young developers in writing accessible, high-performance UI code.',
    availability: 'Saturdays (2-4 hours)',
    status: 'Pending',
    appliedDate: '2026-10-21',
  },
];

const getLocalMentorApps = () => {
  const saved = localStorage.getItem(MENTOR_APPLICATIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(MENTOR_APPLICATIONS_KEY, JSON.stringify(INITIAL_MENTOR_APPS));
  return INITIAL_MENTOR_APPS;
};

const normalizeMentorApp = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    currentRole: row.current_role || row.currentRole,
    organization: row.organization,
    skills: row.skills || [],
    experience: row.experience,
    topics: row.topics || [],
    linkedIn: row.linkedin_url || row.linkedIn,
    github: row.github_url || row.github,
    reason: row.reason,
    availability: row.availability,
    status: row.status || 'Pending',
    appliedDate: row.created_at ? row.created_at.split('T')[0] : (row.appliedDate || '2026-10-22'),
  };
};

export const mentorshipService = {
  // Fetch mentor applications (Admin)
  async getApplications() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mentor_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(normalizeMentorApp);
        }
      } catch (err) {
        console.warn('Supabase getMentorApplications error:', err);
      }
    }
    return getLocalMentorApps();
  },

  // Submit mentor application
  async submitApplication(appData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          name: appData.name,
          email: appData.email,
          phone: appData.phone,
          current_role: appData.currentRole,
          organization: appData.organization,
          skills: Array.isArray(appData.skills)
            ? appData.skills
            : (appData.skills ? appData.skills.split(',').map((s) => s.trim()) : []),
          experience: appData.experience,
          topics: Array.isArray(appData.topics)
            ? appData.topics
            : (appData.topics ? appData.topics.split(',').map((t) => t.trim()) : []),
          linkedin_url: appData.linkedIn,
          github_url: appData.github,
          reason: appData.reason,
          availability: appData.availability,
          status: 'Pending',
        };

        const { data, error } = await supabase.from('mentor_applications').insert(payload).select().single();
        if (!error && data) return normalizeMentorApp(data);
      } catch (err) {
        console.warn('Supabase submitMentorApplication error:', err);
      }
    }

    const newApp = {
      ...appData,
      id: `ment-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      skills: Array.isArray(appData.skills)
        ? appData.skills
        : (appData.skills ? appData.skills.split(',').map((s) => s.trim()) : []),
      topics: Array.isArray(appData.topics)
        ? appData.topics
        : (appData.topics ? appData.topics.split(',').map((t) => t.trim()) : []),
    };
    const current = getLocalMentorApps();
    const updated = [newApp, ...current];
    localStorage.setItem(MENTOR_APPLICATIONS_KEY, JSON.stringify(updated));
    return newApp;
  },

  // Update status (Admin)
  async updateStatus(id, newStatus) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mentor_applications')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeMentorApp(data);
      } catch (err) {
        console.warn('Supabase updateMentorStatus error:', err);
      }
    }

    const current = getLocalMentorApps();
    const idx = current.findIndex((m) => m.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], status: newStatus };
      localStorage.setItem(MENTOR_APPLICATIONS_KEY, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },
};
