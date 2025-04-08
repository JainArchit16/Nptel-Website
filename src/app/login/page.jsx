"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { doCredentialLogin } from "../../../utils/loginHelper";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState(false);
  const [pass, setPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [click, setClick] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    const toastId = toast.loading("Authenticating...");
    const { email, password } = data;

    try {
      const response = await doCredentialLogin(email, password);

      toast.dismiss(toastId);
      if (response.ok) {
        toast.success("Welcome back!");
        window.location.href = "/";
      }
      if (response.status == 401) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row bg-white">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <div
                className={`relative border ${
                  errors.email
                    ? "border-red-400"
                    : email
                    ? "border-purple-400"
                    : "border-gray-200"
                } rounded-lg transition-all duration-300 px-4 py-3 focus-within:shadow-sm`}
                onFocus={() => setEmail(true)}
              >
                <label
                  htmlFor="email"
                  className={`absolute transition-all duration-200 ${
                    email
                      ? "text-xs text-purple-600 -top-2.5 left-2 bg-white px-1"
                      : "text-gray-500 top-3 left-4"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full outline-none bg-transparent pt-0 pb-0"
                  onBlurCapture={(e) => {
                    e.target.value.length > 0 ? "" : setEmail(false);
                  }}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <svg
                  className={`absolute right-4 top-3.5 w-5 h-5 ${
                    email ? "text-purple-500" : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div
                className={`relative border ${
                  errors.password
                    ? "border-red-400"
                    : pass
                    ? "border-purple-400"
                    : "border-gray-200"
                } rounded-lg transition-all duration-300 px-4 py-3 focus-within:shadow-sm`}
                onFocus={() => setPass(true)}
              >
                <label
                  htmlFor="password"
                  className={`absolute transition-all duration-200 ${
                    pass
                      ? "text-xs text-purple-600 -top-2.5 left-2 bg-white px-1"
                      : "text-gray-500 top-3 left-4"
                  }`}
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full outline-none bg-transparent pt-0 pb-0"
                  onBlurCapture={(e) => {
                    if (e.target.value.length === 0) {
                      setPass(false);
                      setClick(false);
                    }
                  }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgotpass"
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </button>
          </form>

          {/* <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Or continue with</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fill="#1877F2"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>
          </div> */}
        </div>

        {/* Right side - Image and CTA */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/90 to-indigo-800/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('/assests/login/login.jpeg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-4 text-center">New Here?</h2>
            <div className="w-16 h-1 bg-purple-300 rounded-full mb-6"></div>
            <p className="text-lg text-center mb-8 text-purple-100">
              Join our community and discover a world of possibilities
            </p>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all duration-300 font-medium"
            >
              Create Account
            </Link>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-white/30"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white/30"></span>
            </div>
          </div>
        </div>

        {/* Mobile Sign Up CTA */}
        <div className="block md:hidden p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Don't have an account?</h2>
          <Link
            href="/signup"
            className="inline-block mt-2 px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-800 transition-all duration-300 text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
