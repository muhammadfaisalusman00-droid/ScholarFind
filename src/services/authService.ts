import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_STORAGE_KEY = 'sf_admin_session';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export const authService = {
  async signIn(email: string, pass: string): Promise<{ user: AdminUser | null; error: string | null }> {
    // 1. Production Mode: Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Verify user is in admin_users table
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          return {
            user: null,
            error: 'Access Denied: Your account is not authorized as a ScholarFind administrator.',
          };
        }

        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: (adminRecord.role as 'admin' | 'superadmin') || 'superadmin',
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return { user: adminUser, error: null };
      }

      return { user: null, error: 'Failed to authenticate user.' };
    }

    // 2. Local Prototype / Offline Fallback Mode (Active ONLY when Supabase is unconfigured)
    if (email && pass && pass.length >= 4) {
      const mockAdmin: AdminUser = {
        id: 'admin-001',
        email,
        role: 'admin',
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mockAdmin));
      return { user: mockAdmin, error: null };
    }

    return { user: null, error: 'Invalid email or password. Password must be at least 4 characters.' };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  },

  getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return { success: false, error: 'No active administrator session found. Please log in again.' };
    }

    if (isSupabaseConfigured() && supabase) {
      // 1. Re-authenticate current user with their email and current password
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (reAuthError) {
        return { success: false, error: 'Current password is incorrect.' };
      }

      // 2. Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return { success: false, error: updateError.message || 'Failed to update password.' };
      }

      return { success: true, error: null };
    }

    // Offline / Local Prototype Fallback Mode
    if (!currentPassword) {
      return { success: false, error: 'Current password is required.' };
    }

    return { success: true, error: null };
  }
};
