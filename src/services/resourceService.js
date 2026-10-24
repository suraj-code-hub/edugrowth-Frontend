import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_NOTES, INITIAL_PROJECTS } from '../data/initialData';

const NOTES_KEY = 'edugrowth_notes';
const PROJECTS_KEY = 'edugrowth_projects';

const getLocalNotes = () => {
  const saved = localStorage.getItem(NOTES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
  return INITIAL_NOTES;
};

const getLocalProjects = () => {
  const saved = localStorage.getItem(PROJECTS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
};

const normalizeNote = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    pages: row.pages || 48,
    format: row.format || 'PDF',
    isPaid: Number(row.price) > 0,
    price: Number(row.price) || 0,
    downloadCount: row.download_count || 1200,
    description: row.description || '',
    author: row.author || 'EduGrowth Lead Editorial',
    updatedDate: row.updated_at ? row.updated_at.split('T')[0] : '2026-10-20',
    tags: row.tags || ['Handwritten Notes', 'Best Practices', 'Quick Revision'],
    filePath: row.file_path,
    previewInfo: row.preview_info,
  };
};

const normalizeProject = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    techStack: row.technology_stack || row.techStack || ['React', 'PostgreSQL', 'Tailwind CSS'],
    image: row.image_path || row.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: row.description || '',
    features: row.features || [
      'Production-ready authentication and RBAC',
      'High-performance PostgreSQL queries',
      'Responsive interface with Tailwind CSS',
    ],
    demoUrl: row.demo_url || row.demoUrl,
    githubUrl: row.repository_url || row.githubUrl,
  };
};

export const resourceService = {
  // Fetch learning resources / notes
  async getAllNotes(filters = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('learning_resources').select('*');
        if (filters.status) query = query.eq('status', filters.status);
        else query = query.eq('status', 'published');

        if (filters.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeNote);
          if (filters.priceType === 'Free') {
            mapped = mapped.filter((n) => !n.isPaid);
          } else if (filters.priceType === 'Paid') {
            mapped = mapped.filter((n) => n.isPaid);
          }
          if (filters.search) {
            const q = filters.search.toLowerCase();
            mapped = mapped.filter(
              (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
            );
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase learning_resources error:', err);
      }
    }

    let notes = getLocalNotes();
    if (filters.category && filters.category !== 'All') {
      notes = notes.filter((n) => n.category === filters.category);
    }
    if (filters.priceType === 'Free') {
      notes = notes.filter((n) => !n.isPaid);
    } else if (filters.priceType === 'Paid') {
      notes = notes.filter((n) => n.isPaid);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      notes = notes.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }
    return notes;
  },

  // Fetch showcase projects
  async getAllProjects(filters = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('projects').select('*');
        if (filters.status) query = query.eq('status', filters.status);
        else query = query.eq('status', 'published');

        if (filters.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeProject);
          if (filters.search) {
            const q = filters.search.toLowerCase();
            mapped = mapped.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
            );
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase projects error:', err);
      }
    }

    let projects = getLocalProjects();
    if (filters.category && filters.category !== 'All') {
      projects = projects.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return projects;
  },

  // Add new note / learning resource (Content Manager)
  async addNote(noteData, creatorId = null) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          title: noteData.title,
          category: noteData.category,
          price: Number(noteData.price) || 0,
          currency: 'INR',
          is_free: Number(noteData.price) === 0,
          description: noteData.description,
          file_path: noteData.filePath || `learning-resources/${noteData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          preview_info: noteData.previewInfo || `${noteData.pages || 40} pages`,
          status: 'published',
          created_by: creatorId,
        };

        const { data, error } = await supabase.from('learning_resources').insert(payload).select().single();
        if (!error && data) return normalizeNote(data);
      } catch (err) {
        console.warn('Supabase addNote error:', err);
      }
    }

    const newNote = {
      ...noteData,
      id: `n-${Date.now()}`,
      downloadCount: 0,
      updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    const current = getLocalNotes();
    const updated = [newNote, ...current];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return newNote;
  },

  // Add new showcase project (Content Manager & Admin)
  async addProject(projectData, creatorId = null) {
    const slug = (projectData.title || 'project')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          title: projectData.title,
          slug,
          category: projectData.category,
          description: projectData.description,
          technology_stack: projectData.techStack || [],
          image_path: projectData.image,
          demo_url: projectData.demoUrl,
          repository_url: projectData.githubUrl,
          status: 'published',
          created_by: creatorId,
        };

        const { data, error } = await supabase.from('projects').insert(payload).select().single();
        if (!error && data) return normalizeProject(data);
      } catch (err) {
        console.warn('Supabase addProject error:', err);
      }
    }

    const newProject = {
      ...projectData,
      id: `p-${Date.now()}`,
      slug,
    };
    const current = getLocalProjects();
    const updated = [newProject, ...current];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return newProject;
  },
};
