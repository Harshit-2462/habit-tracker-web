import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile, UserSettings } from '../types/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; needsEmailVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateSettings: (data: Partial<UserSettings>) => Promise<void>;
}

const DEFAULT_MOCK_PROFILE: UserProfile = {
  id: 'demo-user-123',
  full_name: 'Gotham BatKitty',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  xp: 450,
  level: 3,
  coins: 180,
  current_streak: 5,
  longest_streak: 12,
  total_completions: 28,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_MOCK_SETTINGS: UserSettings = {
  id: 'demo-settings-123',
  user_id: 'demo-user-123',
  theme: 'gotham-dark',
  email_notifications: true,
  reminder_sound: true,
  sound_type: 'kitty-chime',
  daily_reminder_time: '09:00:00',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const createNewUserProfile = (userId: string, name?: string): UserProfile => ({
  id: userId,
  full_name: name || 'Gotham Hero',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  xp: 0,
  level: 1,
  coins: 0,
  current_streak: 0,
  longest_streak: 0,
  total_completions: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndSettings(session.user);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfileAndSettings(session.user);
      } else {
        setProfile(null);
        setSettings(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileAndSettings = async (authUser: User) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        const userName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Gotham Hero';
        setProfile(createNewUserProfile(authUser.id, userName));
      }

      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (settingsData) {
        setSettings(settingsData);
      } else {
        setSettings({ ...DEFAULT_MOCK_SETTINGS, user_id: authUser.id });
      }
    } catch {
      const userName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Gotham Hero';
      setProfile(createNewUserProfile(authUser.id, userName));
      setSettings({ ...DEFAULT_MOCK_SETTINGS, user_id: authUser.id });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfileAndSettings(data.user);
    }
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      return { error: error as Error, needsEmailVerification: false };
    }

    // Check if Supabase requires email verification (data.session will be null if email confirmation is enabled)
    if (data.user && !data.session) {
      return { error: null, needsEmailVerification: true };
    }

    if (data.user && data.session) {
      setUser(data.user);
      setSession(data.session);
      setProfile(createNewUserProfile(data.user.id, fullName));
      setSettings({ ...DEFAULT_MOCK_SETTINGS, user_id: data.user.id });
      return { error: null, needsEmailVerification: false };
    }

    return { error: null, needsEmailVerification: true };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signInAsGuest = () => {
    const guestUser = {
      id: 'demo-user-123',
      email: 'demo@batkitty.com',
      app_metadata: {},
      user_metadata: { full_name: 'Gotham BatKitty' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    setUser(guestUser);
    setProfile(DEFAULT_MOCK_PROFILE);
    setSettings(DEFAULT_MOCK_SETTINGS);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setSettings(null);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (user && user.id !== 'demo-user-123') {
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
      if (!error) {
        setProfile(prev => prev ? { ...prev, ...data } : null);
      }
    } else {
      setProfile(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const updateSettings = async (data: Partial<UserSettings>) => {
    if (user && user.id !== 'demo-user-123') {
      const { error } = await supabase.from('settings').update(data).eq('user_id', user.id);
      if (!error) {
        setSettings(prev => prev ? { ...prev, ...data } : null);
      }
    } else {
      setSettings(prev => prev ? { ...prev, ...data } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        settings,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        resetPassword,
        updateProfile,
        updateSettings,
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
