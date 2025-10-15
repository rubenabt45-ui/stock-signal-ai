import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentMockUser, MockUserProfile } from '@/mocks/userProfile';
import { fakeClient } from '@/lib/fakeClient';

export interface FakeAuthContextType {
  user: { id: string; email: string } | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  userProfile?: MockUserProfile;
}


const FakeAuthContext = createContext<FakeAuthContextType | undefined>(undefined);

export const useFakeAuth = () => {
  const context = useContext(FakeAuthContext);
  if (!context) {
    throw new Error('useFakeAuth must be used within FakeAuthProvider');
  }
  return context;
};

export const FakeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<MockUserProfile>();

  useEffect(() => {
    // Initialize auth state
    fakeClient.auth.getSession().then(({ data }) => {
      const session = data?.session;
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        setUserProfile(getCurrentMockUser());
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = fakeClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        setUserProfile(getCurrentMockUser());
      } else {
        setUserProfile(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: FakeAuthContextType = {
    user,
    session,
    loading,
    userProfile,
    signIn: async (email: string, password: string) => {
      const result = await fakeClient.auth.signIn(email, password);
      if (!result.error) {
        setUser(result.data?.session?.user || null);
        setSession(result.data?.session || null);
        setUserProfile(getCurrentMockUser());
      }
      return result;
    },
    signUp: async (email: string, password: string, fullName?: string) => {
      const result = await fakeClient.auth.signUp(email, password, fullName);
      if (!result.error) {
        setUser({ id: 'demo-user', email });
        setUserProfile(getCurrentMockUser());
      }
      return result;
    },
    signOut: async () => {
      await fakeClient.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(undefined);
    },
    resetPassword: async (email: string) => fakeClient.auth.resetPassword(email),
    updatePassword: async (password: string) => fakeClient.auth.updatePassword(password),
    resendConfirmation: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null }),
  };

  return <FakeAuthContext.Provider value={value}>{children}</FakeAuthContext.Provider>;
};

// Export as useAuth for compatibility
export const useAuth = useFakeAuth;
