"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import type { AuthContextType, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const kindeAuth = useKindeAuth();
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    getToken,
    getPermissions,
    getOrganization,
    logout: kindeLogout
  } = kindeAuth;

  const [authState, setAuthState] = useState<{
    user: User | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (isLoading) {
      setAuthState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (isAuthenticated && user) {
      const transformedUser: User = {
        id: user.id || '',
        email: user.email || '',
        given_name: user.given_name || undefined,
        family_name: user.family_name || undefined,
        picture: user.picture || undefined,
      };
      
      setAuthState({
        user: transformedUser,
        loading: false,
        error: null,
      });
    } else {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  }, [isAuthenticated, user, isLoading]);

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use Kinde's hosted authentication page
      // This will redirect to Kinde's authentication flow
      const authUrl = `https://ahmedai.kinde.com/auth?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile email&start_page=signup`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use Kinde's hosted authentication page
      const authUrl = `https://ahmedai.kinde.com/auth?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile email&start_page=login`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      }));
      throw error;
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use Kinde's OAuth flow
      const authUrl = `https://ahmedai.kinde.com/auth?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile email&connection=${provider}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('OAuth error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : `${provider} sign in failed` 
      }));
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use Kinde's magic link flow
      const authUrl = `https://ahmedai.kinde.com/auth?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile email&connection=email&email=${encodeURIComponent(email)}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Magic link error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Magic link sign in failed' 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Try to use Kinde's SDK logout method first, if available
      if (kindeLogout && typeof kindeLogout === 'function') {
        await kindeLogout();
      } else {
        // Fallback to manual redirect
        const logoutUrl = `https://ahmedai.kinde.com/logout?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=${encodeURIComponent('http://localhost:3000')}`;
        window.location.href = logoutUrl;
      }
      
      // Clear local state
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Use Kinde's password reset flow
      const authUrl = `https://ahmedai.kinde.com/auth?client_id=1548a31daf4042d4821aa028ffc87d05&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile email&start_page=forgot_password`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signInWithOAuth,
    signInWithMagicLink,
    signOut,
    resetPassword,
    getToken, // Expose the getToken function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
