"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "@/validation/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual login logic here
      console.log("Login attempt:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just show success (replace with actual login logic)
      console.log("Login successful");
    } catch (error) {
      setFieldError("general", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="text-white/70">Sign in to your account to continue</p>
      </div>

      {/* Formik Form */}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <Field name="email">
                {({ field, meta }: any) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      "bg-white/10 border-white/20 text-white placeholder:text-white/50",
                      "focus:bg-white/20 focus:border-white/40",
                      "transition-all duration-200",
                      meta.touched &&
                        meta.error &&
                        "border-red-400 focus:border-red-400"
                    )}
                    disabled={isLoading}
                    onChange={(e) => {
                      field.onChange(e);
                      setFieldValue("email", e.target.value);
                    }}
                    onBlur={(e) => {
                      field.onBlur(e);
                      setFieldTouched("email", true);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="email">
                {(msg) => <p className="text-red-400 text-sm">{msg}</p>}
              </ErrorMessage>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password
              </Label>
              <div className="relative">
                <Field name="password">
                  {({ field, meta }: any) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12",
                        "focus:bg-white/20 focus:border-white/40",
                        "transition-all duration-200",
                        meta.touched &&
                          meta.error &&
                          "border-red-400 focus:border-red-400"
                      )}
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        setFieldValue("password", e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur(e);
                        setFieldTouched("password", true);
                      }}
                    />
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <ErrorMessage name="password">
                {(msg) => <p className="text-red-400 text-sm">{msg}</p>}
              </ErrorMessage>
            </div>

            {/* General Error */}
            <ErrorMessage name="general">
              {(msg) => (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{msg}</p>
                </div>
              )}
            </ErrorMessage>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg cursor-pointer"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Links */}
      <div className="text-center space-y-3">
        <div className="text-sm">
          <span className="text-white/70">Don't have an account? </span>
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
