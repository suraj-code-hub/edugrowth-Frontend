import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const INITIAL_STAFF = [
  { id: 'st-1', name: 'Dr. Rajesh Nair', email: 'rajesh.nair@edugrowth.edu', role: 'CONTENT_MANAGER', status: 'Active' },
  { id: 'st-2', name: 'Tanvi Saxena', email: 'tanvi.s@edugrowth.edu', role: 'PLACEMENT_MANAGER', status: 'Active' },
  { id: 'st-3', name: 'Manoj Kumar', email: 'manoj.k@edugrowth.edu', role: 'SUPPORT_MANAGER', status: 'Active' },
  { id: 'st-4', name: 'Sunil Rao', email: 'sunil.r@edugrowth.edu', role: 'FINANCE_MANAGER', status: 'Active' },
];

const LOCAL_STORAGE_KEY = 'edugrowth_staff';

const getLocalStaff = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
  return INITIAL_STAFF;
};

export const staffService = {
  // Fetch staff list for Admin
  async getStaffList() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('staff_accounts')
          .select('*, profiles (full_name, email)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((s) => ({
            id: s.id,
            userId: s.user_id,
            name: s.display_name || s.profiles?.full_name || 'Staff Member',
            email: s.profiles?.email || 'staff@edugrowth.edu',
            role: s.role,
            status: s.is_active ? 'Active' : 'Inactive',
          }));
        }
      } catch (err) {
        console.warn('Supabase getStaffList error:', err);
      }
    }
    return getLocalStaff();
  },

  // Assign staff role (via secure RPC)
  async assignStaffRole(email, role, displayName) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('admin_assign_staff_role', {
          target_email: email,
          assigned_role: role,
          staff_display_name: displayName,
        });

        if (error) throw error;
        return { success: true, message: data?.message || 'Staff role assigned successfully!' };
      } catch (err) {
        console.warn('RPC assignStaffRole failed, using local simulation:', err);
      }
    }

    const current = getLocalStaff();
    const newStaff = {
      id: `st-${Date.now()}`,
      name: displayName || email.split('@')[0],
      email,
      role,
      status: 'Active',
    };
    const updated = [newStaff, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, staff: newStaff };
  },

  // Toggle staff active/inactive state
  async toggleStaffStatus(staffId, currentStatus, currentUserId) {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const isActive = newStatus === 'Active';

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('staff_accounts')
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq('id', staffId);

        if (error) throw error;
        return { success: true, newStatus };
      } catch (err) {
        console.warn('Supabase toggleStaffStatus error:', err);
      }
    }

    const current = getLocalStaff();
    const idx = current.findIndex((s) => s.id === staffId);
    if (idx !== -1) {
      current[idx].status = newStatus;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    }
    return { success: true, newStatus };
  },
};
