"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import type { AuthModalProps } from '@/types/auth';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function AuthModal({ isOpen, onClose, onSuccess, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, currentLang } = useLanguage();

  console.log('AuthModal rendered with:', { isOpen, mode, email, password });

  if (!isOpen) return null;

  const toggleMode = () => {
    setError('');
    setEmail('');
    setPassword('');
    
    // Call the parent callback to change mode
    if (onModeChange) {
      const newMode = mode === 'signin' ? 'signup' : 'signin';
      onModeChange(newMode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col gap-6 min-w-[400px] max-w-[500px] relative shadow-xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'signup' ? (currentLang === 'ar' ? 'إنشاء حساب' : 'Create Account') : (currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
          </h2>
          <p className="text-zinc-400">
            {mode === 'signup' 
              ? (currentLang === 'ar' ? 'انضم إلينا لبدء تحضيرك لمقابلة الذكاء الاصطناعي' : 'Join us to start your AI interview preparation')
              : (currentLang === 'ar' ? 'مرحباً بعودتك! سجل دخولك للمتابعة' : 'Welcome back! Sign in to continue')
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-center">
          {/* Use Kinde's built-in components for email/password auth */}
          {mode === 'signup' ? (
            <RegisterLink className="w-full max-w-xs bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              {currentLang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
            </RegisterLink>
          ) : (
            <LoginLink className="w-full max-w-xs bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              {currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </LoginLink>
          )}
        </div>

        <div className="text-center text-sm">
          <span className="text-zinc-400">
            {mode === 'signup' 
              ? (currentLang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?')
              : (currentLang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?")
            }
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {mode === 'signup' 
              ? (currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign in')
              : (currentLang === 'ar' ? 'إنشاء حساب' : 'Sign up')
            }
          </button>
        </div>
      </div>
    </div>
  );
}
