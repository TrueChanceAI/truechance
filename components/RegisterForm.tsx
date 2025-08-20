"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRegistration } from "@/types/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useLanguage } from "@/lib/hooks/useLanguage";

// Validation schema using Yup
const RegisterValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface RegisterFormProps {
  onSuccess?: () => void;
  onModeChange?: () => void;
}

export default function RegisterForm({
  onSuccess,
  onModeChange,
}: RegisterFormProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (
    values: any,
    { setSubmitting, setFieldError }: any
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success(
        "OTP sent to your email! Please check your inbox and enter the verification code."
      );
      // Don't reset form yet - user needs to enter OTP
      // You might want to show an OTP input field here
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setFieldError("general", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {t("auth.createAccount")}
        </h1>
        <p className="text-white/70">{t("auth.signUpToGetStarted")}</p>
      </div>

      {/* Formik Form */}
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterValidationSchema}
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-medium">
                  {t("auth.firstName")}
                </Label>
                <Field name="firstName">
                  {({ field, meta }: any) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder={t("auth.firstNamePlaceholder")}
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
                        setFieldValue("firstName", e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur(e);
                        setFieldTouched("firstName", true);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage name="firstName">
                  {(msg) => <p className="text-red-400 text-sm">{msg}</p>}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-medium">
                  {t("auth.lastName")}
                </Label>
                <Field name="lastName">
                  {({ field, meta }: any) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder={t("auth.lastNamePlaceholder")}
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
                        setFieldValue("lastName", e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur(e);
                        setFieldTouched("lastName", true);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage name="lastName">
                  {(msg) => <p className="text-red-400 text-sm">{msg}</p>}
                </ErrorMessage>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                {t("auth.emailAddress")}
              </Label>
              <Field name="email">
                {({ field, meta }: any) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
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

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white font-medium">
                {t("auth.phoneNumber")}
              </Label>
              <Field name="phoneNumber">
                {({ field, meta }: any) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    placeholder={t("auth.phoneNumberPlaceholder")}
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
                      setFieldValue("phoneNumber", e.target.value);
                    }}
                    onBlur={(e) => {
                      field.onBlur(e);
                      setFieldTouched("phoneNumber", true);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="phoneNumber">
                {(msg) => <p className="text-red-400 text-sm">{msg}</p>}
              </ErrorMessage>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Field name="password">
                  {({ field, meta }: any) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.passwordPlaceholder")}
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-white font-medium"
              >
                {t("auth.confirmPassword")}
              </Label>
              <div className="relative">
                <Field name="confirmPassword">
                  {({ field, meta }: any) => (
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
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
                        setFieldValue("confirmPassword", e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur(e);
                        setFieldTouched("confirmPassword", true);
                      }}
                    />
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <ErrorMessage name="confirmPassword">
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
                  {t("auth.creatingAccount")}
                </div>
              ) : (
                t("auth.signUp")
              )}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Links */}
      <div className="text-center space-y-3">
        <div className="text-sm">
          <span className="text-white/70">{t("auth.alreadyHaveAccount")} </span>
          <Link
            href="/signin"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {t("auth.signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
