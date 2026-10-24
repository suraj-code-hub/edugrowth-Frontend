import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_COURSES } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'edugrowth_courses';

const getLocalCourses = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
};

// Normalizer: Maps Supabase PostgreSQL table columns to frontend component format
const normalizeCourse = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || row.title?.toLowerCase().replace(/\s+/g, '-'),
    category: row.category,
    level: row.difficulty || row.level || 'All Levels',
    price: Number(row.price) || 0,
    isPaid: Number(row.price) > 0,
    duration: row.duration || '8 Weeks',
    rating: row.rating || 4.9,
    enrolledCount: row.enrolled_count || row.enrolledCount || 120,
    instructor: row.instructor || 'EduGrowth Lead Instructors',
    badge: row.price === 0 ? 'Free' : 'Premium',
    description: row.description || '',
    thumbnail: row.thumbnail_path || row.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    status: row.status || 'published',
    curriculum: row.course_sections?.map((s) => ({
      id: s.id,
      title: s.title,
      duration: s.duration || '',
      lessons: s.lessons?.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration || '30 mins',
        isFreePreview: l.is_free_preview,
        content: l.content,
      })) || [],
    })) || row.curriculum || [],
  };
};

export const courseService = {
  // Fetch all published courses (or all for Content Manager/Admin)
  async getAllCourses(filters = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('courses').select(`
          *,
          course_sections (
            id,
            title,
            sort_order,
            lessons (
              id,
              title,
              duration,
              is_free_preview,
              sort_order
            )
          )
        `);

        if (filters.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }
        if (filters.level && filters.level !== 'All') {
          query = query.eq('difficulty', filters.level);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        } else {
          // Public view defaults to published courses
          query = query.eq('status', 'published');
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          let mapped = data.map(normalizeCourse);

          if (filters.search) {
            const q = filters.search.toLowerCase();
            mapped = mapped.filter(
              (c) =>
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q)
            );
          }
          if (filters.priceType === 'Free') {
            mapped = mapped.filter((c) => !c.isPaid);
          } else if (filters.priceType === 'Paid') {
            mapped = mapped.filter((c) => c.isPaid);
          }
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase course fetch error, using fallback:', err);
      }
    }

    // Local fallback
    let list = getLocalCourses();
    if (filters.category && filters.category !== 'All') {
      list = list.filter((c) => c.category === filters.category);
    }
    if (filters.level && filters.level !== 'All') {
      list = list.filter((c) => c.level === filters.level);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    if (filters.priceType === 'Free') {
      list = list.filter((c) => !c.isPaid);
    } else if (filters.priceType === 'Paid') {
      list = list.filter((c) => c.isPaid);
    }
    return list;
  },

  // Fetch course details by ID or Slug
  async getCourseById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const isUuid = id.length === 36 && id.includes('-');
        let query = supabase.from('courses').select(`
          *,
          course_sections (
            id,
            title,
            sort_order,
            lessons (
              id,
              title,
              description,
              content,
              video_url,
              duration,
              is_free_preview,
              sort_order
            )
          )
        `);

        if (isUuid) {
          query = query.eq('id', id);
        } else {
          query = query.or(`id.eq.${id},slug.eq.${id}`);
        }

        const { data, error } = await query.single();
        if (!error && data) return normalizeCourse(data);
      } catch (err) {
        console.warn('Supabase getCourseById error:', err);
      }
    }
    const courses = getLocalCourses();
    return courses.find((c) => c.id === id || c.slug === id) || null;
  },

  // Create a new course (Content Manager & Admin)
  async createCourse(courseData, creatorId = null) {
    const slug = (courseData.title || 'course')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .insert({
            title: courseData.title,
            slug,
            description: courseData.description,
            category: courseData.category,
            difficulty: courseData.level || 'All Levels',
            duration: courseData.duration || '8 Weeks',
            price: Number(courseData.price) || 0,
            currency: 'INR',
            thumbnail_path: courseData.thumbnail,
            status: courseData.status || 'draft',
            created_by: creatorId,
          })
          .select()
          .single();

        if (!error && data) {
          return normalizeCourse(data);
        }
      } catch (err) {
        console.warn('Supabase createCourse error:', err);
      }
    }

    const newCourse = {
      ...courseData,
      id: `c-${Date.now()}`,
      slug,
      enrolledCount: 0,
      rating: 5.0,
      curriculum: courseData.curriculum || [],
    };
    const current = getLocalCourses();
    const updated = [newCourse, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newCourse;
  },

  // Update existing course
  async updateCourse(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbUpdates = {
          updated_at: new Date().toISOString(),
        };
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.category) dbUpdates.category = updates.category;
        if (updates.level) dbUpdates.difficulty = updates.level;
        if (updates.duration) dbUpdates.duration = updates.duration;
        if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
        if (updates.thumbnail) dbUpdates.thumbnail_path = updates.thumbnail;
        if (updates.status) dbUpdates.status = updates.status;

        const { data, error } = await supabase
          .from('courses')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeCourse(data);
      } catch (err) {
        console.warn('Supabase updateCourse error:', err);
      }
    }

    const current = getLocalCourses();
    const idx = current.findIndex((c) => c.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },

  // Student course enrollment
  async enrollStudent(studentId, courseId) {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .upsert(
            {
              student_id: studentId,
              course_id: courseId,
              status: 'active',
            },
            { onConflict: 'student_id,course_id' }
          )
          .select()
          .single();

        if (!error && data) return { success: true, enrollment: data };
      } catch (err) {
        console.warn('Supabase enroll error:', err);
      }
    }
    return { success: true, enrollment: { student_id: studentId, course_id: courseId } };
  },

  // Get enrolled courses for a student
  async getStudentEnrollments(studentId) {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('course_id, enrolled_at, status, courses (*)')
          .eq('student_id', studentId);

        if (!error && data) {
          return data.map((item) => ({
            ...normalizeCourse(item.courses),
            enrolledAt: item.enrolled_at,
            enrollmentStatus: item.status,
          }));
        }
      } catch (err) {
        console.warn('Supabase getStudentEnrollments error:', err);
      }
    }
    return [];
  },

  // Track student lesson completion
  async updateLessonProgress(studentId, lessonId, isCompleted) {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .upsert(
            {
              student_id: studentId,
              lesson_id: lessonId,
              is_completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'student_id,lesson_id' }
          )
          .select()
          .single();

        if (!error) return { success: true, progress: data };
      } catch (err) {
        console.warn('Supabase lesson progress error:', err);
      }
    }
    return { success: true, lessonId, isCompleted };
  },
};
