"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {} from "react";
import type { AuthModalProps } from "@/types/auth";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { useDispatch } from "react-redux";
import { setMe, setSessionToken } from "@/redux/slices/meSlice";

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  onModeChange,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, currentLang } = useLanguage();
  const dispatch = useDispatch();

  console.log("AuthModal rendered with:", { isOpen, mode, email, password });

  if (!isOpen) return null;

  const toggleMode = () => {
    setError("");
    setEmail("");
    setPassword("");

    // Call the parent callback to change mode
    if (onModeChange) {
      const newMode = mode === "signin" ? "signup" : "signin";
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === "signup" ? t("auth.createAccount") : t("auth.signIn")}
          </h2>
          <p className="text-zinc-400">
            {mode === "signup"
              ? t("auth.signUpToGetStarted")
              : t("auth.signInToContinue")}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError("");
            try {
              if (mode === "signup") {
                const res = await fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    password,
                    firstName: "",
                    lastName: "",
                  }),
                });
                const data = await res.json();
                if (!res.ok)
                  throw new Error(data.error || "Registration failed");
                onSuccess?.();
              } else {
                const res = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Login failed");
                dispatch(
                  setMe({
                    id: data.user.id,
                    name: `${data.user.firstName} ${data.user.lastName}`.trim(),
                    email: data.user.email,
                    phoneNumber: data.user.phoneNumber,
                    isEmailVerified: data.user.isEmailVerified,
                  })
                );
                dispatch(setSessionToken(data.sessionToken));
                onSuccess?.();
                onClose();
              }
            } catch (e: any) {
              setError(e.message || "Authentication failed");
            } finally {
              setIsLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-white font-medium">
              {t("auth.emailAddress")}
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white font-medium">
              {t("auth.password")}
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-gradient-to-br from-purple-600 to-blue-500"
          >
            {mode === "signup" ? t("auth.createAccount") : t("auth.signIn")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-400">
            {mode === "signup"
              ? t("auth.alreadyHaveAccount")
              : t("auth.dontHaveAccount")}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {mode === "signup" ? t("auth.signIn") : t("auth.signUp")}
          </button>
        </div>
      </div>
    </div>
  );
}
