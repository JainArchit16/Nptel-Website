"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Mail,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    const { email, password, name, confirmPassword } = data;
    const toastId = toast.loading("Creating your account...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", name);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    try {
      const response = await fetch(`/api/signup`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      toast.dismiss(toastId);

      if (responseData.success) {
        toast.success(responseData.message);
        router.push("/login");
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(`Signup failed: ${error.message}`);
      console.error(error.message);
    }
  }

  const isFieldActive = (fieldName) => {
    return focusedField === fieldName || !!getValues(fieldName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        {/* Left side - Image and CTA */}
        <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-sky-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          <img
            src="/assests/login/login.jpeg"
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
            alt="Signup background"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            <div className="max-w-md text-center">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                Welcome Back
              </h2>
              <div className="w-16 h-1 bg-white/70 mx-auto rounded-full mb-6"></div>
              <p className="text-lg mb-10 text-white/90">
                Already have an account? Sign in to continue your journey with
                us.
              </p>
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm py-3 px-6 rounded-lg transition-all duration-300 text-white"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h1>
              <p className="text-gray-500">
                Join our community and start your journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <div
                  className={`group border-2 rounded-lg px-4 py-3 transition-all duration-300 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : isFieldActive("email")
                      ? "border-sky-500 bg-sky-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label
                    htmlFor="email"
                    className={`absolute transition-all duration-200 ${
                      isFieldActive("email")
                        ? "-top-2.5 left-3 text-xs bg-white px-1 text-sky-600"
                        : "top-3 left-10 text-gray-500"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="flex items-center gap-3">
                    <Mail
                      className={`w-5 h-5 ${
                        isFieldActive("email")
                          ? "text-sky-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      id="email"
                      className="outline-none w-full bg-transparent"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Full Name Field */}
              <div className="relative">
                <div
                  className={`group border-2 rounded-lg px-4 py-3 transition-all duration-300 ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : isFieldActive("name")
                      ? "border-sky-500 bg-sky-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label
                    htmlFor="name"
                    className={`absolute transition-all duration-200 ${
                      isFieldActive("name")
                        ? "-top-2.5 left-3 text-xs bg-white px-1 text-sky-600"
                        : "top-3 left-10 text-gray-500"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="flex items-center gap-3">
                    <User
                      className={`w-5 h-5 ${
                        isFieldActive("name") ? "text-sky-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      id="name"
                      className="outline-none w-full bg-transparent"
                      {...register("name", {
                        required: "Full name is required",
                      })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div
                  className={`group border-2 rounded-lg px-4 py-3 transition-all duration-300 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : isFieldActive("password")
                      ? "border-sky-500 bg-sky-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label
                    htmlFor="password"
                    className={`absolute transition-all duration-200 ${
                      isFieldActive("password")
                        ? "-top-2.5 left-3 text-xs bg-white px-1 text-sky-600"
                        : "top-3 left-10 text-gray-500"
                    }`}
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-3">
                    <Lock
                      className={`w-5 h-5 ${
                        isFieldActive("password")
                          ? "text-sky-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="outline-none w-full bg-transparent"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div
                  className={`group border-2 rounded-lg px-4 py-3 transition-all duration-300 ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : isFieldActive("confirmPassword")
                      ? "border-sky-500 bg-sky-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute transition-all duration-200 ${
                      isFieldActive("confirmPassword")
                        ? "-top-2.5 left-3 text-xs bg-white px-1 text-sky-600"
                        : "top-3 left-10 text-gray-500"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-3">
                    <Lock
                      className={`w-5 h-5 ${
                        isFieldActive("confirmPassword")
                          ? "text-sky-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="outline-none w-full bg-transparent"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === getValues("password") ||
                          "Passwords do not match",
                      })}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                <span>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
              </button>

              {/* Mobile Login Link */}
              <div className="text-center md:hidden mt-6">
                <p className="text-gray-500 mb-2">Already have an account?</p>
                <Link
                  href="/login"
                  className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
