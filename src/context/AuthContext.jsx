import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { profileService } from '../services/profileService';
import { courseService } from '../services/courseService';
import { jobService } from '../services/jobService';

export const ROLES = {
  ADMIN: 'ADMIN',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  PLACEMENT_MANAGER: 'PLACEMENT_MANAGER',
  SUPPORT_MANAGER: 'SUPPORT_MANAGER',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  STUDENT: 'STUDENT',
};

// Default profile for initial preview & student experience
const DEFAULT_STUDENT_PROFILE = {
  id: 'usr-student-001',
  fullName: 'Suraj Kumar',
  email: 'surajkumar754100@gmail.com',
  role: ROLES.STUDENT,
  phone: '+91 9876543210',
  alternatePhone: '+91 9876543211',
  college: 'Indian Institute of Information Technology',
  education: 'B.Tech in Computer Science & Engineering (Final Year)',
  skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'SQL', 'Git', 'Data Structures'],
  about: 'Aspiring Full-Stack Software Engineer passionate about scalable web architecture, clean code, and building high-impact community tools.',
  resumeFileName: 'Suraj_Kumar_Resume_2026.pdf',
  resumeUpdatedDate: '2026-10-22',
  github: 'https://github.com/surajkumar754100',
  linkedin: 'https://linkedin.com/in/surajkumar',
  profileCompletion: 85,
  enrolledCourseIds: ['c-1', 'c-2'],
  savedOpportunityIds: ['opp-1', 'opp-2'],
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edugrowth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  const [loading, setLoading] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState(isSupabaseConfigured());

  // Fetch complete profile and role from Supabase PostgreSQL tables
  const syncSupabaseProfile = async (authUser) => {
    if (!authUser) return;
    try {
      // 1. Fetch role from public.user_roles
      let userRole = ROLES.STUDENT;
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (roleData?.role) {
        userRole = roleData.role;
      } else if (authUser.user_metadata?.role) {
        userRole = authUser.user_metadata.role;
      }

      // 2. Fetch full profile from public.profiles
      const dbProfile = await profileService.getProfile(authUser.id);

      // 3. Fetch enrollments
      const enrollments = await courseService.getStudentEnrollments(authUser.id);
      const enrolledIds = enrollments.map((e) => e.id);

      setUser((prev) => ({
        ...prev,
        id: authUser.id,
        email: authUser.email,
        role: userRole,
        fullName: dbProfile?.fullName || authUser.user_metadata?.full_name || prev.fullName,
        phone: dbProfile?.phone || prev.phone,
        alternatePhone: dbProfile?.alternatePhone || prev.alternatePhone,
        college: dbProfile?.college || prev.college,
        education: dbProfile?.education || prev.education,
        skills: dbProfile?.skills?.length ? dbProfile.skills : prev.skills,
        about: dbProfile?.about || prev.about,
        github: dbProfile?.github || prev.github,
        linkedin: dbProfile?.linkedin || prev.linkedin,
        resumeFileName: dbProfile?.resumeFileName || prev.resumeFileName,
        resumeFilePath: dbProfile?.resumeFilePath || prev.resumeFilePath,
        profileCompletion: dbProfile?.profileCompletion || prev.profileCompletion,
        enrolledCourseIds: enrolledIds.length > 0 ? enrolledIds : prev.enrolledCourseIds,
      }));
    } catch (err) {
      console.warn('Profile sync warning:', err);
    }
  };

  // Check Supabase session on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      setSupabaseReady(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSupabaseProfile(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncSupabaseProfile(session.user);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('edugrowth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edugrowth_user');
    }
  }, [user]);

  // Login handler
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Sync fresh profile from database
        await syncSupabaseProfile(data.user);
        return { success: true, user };
      } else {
        // Immediate local authentication state (preview mode)
        const updatedUser = {
          ...user,
          email,
          fullName: user.fullName || email.split('@')[0],
        };
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Student registration handler - strictly creates STUDENT role
  const registerStudent = async (registrationData) => {
    setLoading(true);
    try {
      const skillsArray = typeof registrationData.skills === 'string'
        ? registrationData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : registrationData.skills;

      if (isSupabaseConfigured() && supabase) {
        // Sign up with Supabase Auth
        // PostgreSQL trigger handles profiles row insertion & assigns STUDENT role
        const { data, error } = await supabase.auth.signUp({
          email: registrationData.email,
          password: registrationData.password,
          options: {
            data: {
              full_name: registrationData.fullName,
              role: ROLES.STUDENT, // Database trigger strictly validates role
              phone: registrationData.phone,
              college: registrationData.college,
              education: registrationData.education,
              skills: skillsArray,
            },
          },
        });
        if (error) throw error;

        const newUser = {
          id: data.user?.id || `usr-student-${Date.now()}`,
          fullName: registrationData.fullName,
          email: registrationData.email,
          role: ROLES.STUDENT,
          phone: registrationData.phone,
          college: registrationData.college,
          education: registrationData.education,
          skills: skillsArray,
          profileCompletion: 60,
          enrolledCourseIds: [],
          savedOpportunityIds: [],
        };
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        const newUser = {
          id: `usr-student-${Date.now()}`,
          fullName: registrationData.fullName,
          email: registrationData.email,
          role: ROLES.STUDENT,
          phone: registrationData.phone,
          alternatePhone: '',
          college: registrationData.college,
          education: registrationData.education,
          skills: skillsArray,
          about: '',
          resumeFileName: '',
          resumeUpdatedDate: '',
          github: '',
          linkedin: '',
          profileCompletion: 60,
          enrolledCourseIds: [],
          savedOpportunityIds: [],
        };
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Password reset handler
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
      }
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (err) {
      return { success: false, error: err.message || 'Password reset request failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(DEFAULT_STUDENT_PROFILE);
  };

  const updateProfile = async (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      let score = 20;
      if (updated.fullName) score += 10;
      if (updated.email) score += 10;
      if (updated.phone) score += 10;
      if (updated.college) score += 10;
      if (updated.education) score += 10;
      if (updated.skills && updated.skills.length > 0) score += 10;
      if (updated.about) score += 10;
      if (updated.resumeFileName) score += 10;
      updated.profileCompletion = Math.min(score, 100);

      // Persist to Supabase if logged in
      if (isSupabaseConfigured() && supabase && prev.id && !prev.id.startsWith('usr-student-001')) {
        profileService.updateProfile(prev.id, updated);
      }
      return updated;
    });
  };

  // Demo role switcher for reviewers to inspect all 6 dashboards easily
  const switchRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setUser((prev) => ({
        ...prev,
        role: newRole,
      }));
    }
  };

  const toggleSaveOpportunity = async (oppId, oppType = 'JOB') => {
    setUser((prev) => {
      const current = prev.savedOpportunityIds || [];
      const exists = current.includes(oppId);
      const updated = exists ? current.filter((id) => id !== oppId) : [...current, oppId];

      if (isSupabaseConfigured() && supabase && prev.id) {
        if (exists) {
          jobService.unsaveOpportunity(prev.id, oppId);
        } else {
          jobService.saveOpportunity(prev.id, oppId, oppType);
        }
      }
      return { ...prev, savedOpportunityIds: updated };
    });
  };

  const enrollInCourse = async (courseId) => {
    setUser((prev) => {
      const current = prev.enrolledCourseIds || [];
      if (!current.includes(courseId)) {
        if (isSupabaseConfigured() && supabase && prev.id) {
          courseService.enrollStudent(prev.id, courseId);
        }
        return { ...prev, enrolledCourseIds: [...current, courseId] };
      }
      return prev;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        supabaseReady,
        login,
        registerStudent,
        resetPassword,
        logout,
        updateProfile,
        switchRole,
        toggleSaveOpportunity,
        enrollInCourse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
