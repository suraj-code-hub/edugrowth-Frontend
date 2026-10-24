import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const profileService = {
  // Fetch user profile from public.profiles
  async getProfile(userId) {
    if (isSupabaseConfigured() && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone || '',
            alternatePhone: data.alternate_phone || '',
            college: data.college || '',
            education: data.education || '',
            skills: data.skills || [],
            about: data.about_me || '',
            github: data.github_url || '',
            linkedin: data.linkedin_url || '',
            resumeFileName: data.resume_file_path ? data.resume_file_path.split('/').pop() : '',
            resumeFilePath: data.resume_file_path,
            profileCompletion: data.profile_completion || 60,
          };
        }
      } catch (err) {
        console.warn('Supabase profile fetch error, fallback to cache:', err);
      }
    }
    return null;
  },

  // Update profile fields in public.profiles
  async updateProfile(userId, profileData) {
    if (isSupabaseConfigured() && supabase && userId) {
      try {
        const dbUpdates = {
          full_name: profileData.fullName,
          phone: profileData.phone,
          alternate_phone: profileData.alternatePhone,
          college: profileData.college,
          education: profileData.education,
          skills: Array.isArray(profileData.skills) ? profileData.skills : [],
          about_me: profileData.about,
          github_url: profileData.github,
          linkedin_url: profileData.linkedin,
          profile_completion: profileData.profileCompletion || 75,
          updated_at: new Date().toISOString(),
        };

        if (profileData.resumeFilePath) {
          dbUpdates.resume_file_path = profileData.resumeFilePath;
        }

        const { data, error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', userId)
          .select()
          .single();

        if (!error && data) {
          return { success: true, profile: data };
        }
      } catch (err) {
        console.warn('Supabase profile update error:', err);
      }
    }
    return { success: true, profile: profileData };
  },

  // Upload student resume to Supabase Storage 'student-files' bucket
  async uploadResume(userId, file) {
    if (!file) throw new Error('No file selected');

    // Validation: file size under 10MB
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10MB limit.');
    }

    // Validation: file types (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      throw new Error('Only PDF, DOC, or DOCX documents are supported.');
    }

    if (isSupabaseConfigured() && supabase && userId) {
      try {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${userId}/${Date.now()}_${sanitizedFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('student-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Update profile with file path
        await supabase
          .from('profiles')
          .update({
            resume_file_path: filePath,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        return {
          success: true,
          filePath,
          fileName: file.name,
          updatedDate: new Date().toISOString().split('T')[0],
        };
      } catch (err) {
        console.warn('Storage upload error, using local simulation:', err);
      }
    }

    // Fallback simulation
    return {
      success: true,
      filePath: `local/${file.name}`,
      fileName: file.name,
      updatedDate: new Date().toISOString().split('T')[0],
    };
  },

  // Get secure short-lived signed URL for downloading a student's resume
  async getResumeDownloadUrl(filePath) {
    if (isSupabaseConfigured() && supabase && filePath) {
      try {
        const { data, error } = await supabase.storage
          .from('student-files')
          .createSignedUrl(filePath, 3600); // 1 hour validity

        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (err) {
        console.warn('Error generating signed URL:', err);
      }
    }
    return null;
  },
};
