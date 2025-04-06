"use client";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full -top-48 -left-48 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -bottom-48 -right-48 mix-blend-screen animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        {/* <nav className="p-6 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QuizNPTEL
            </span>
            <Link
              href="/quiz"
              className="text-sm font-medium hover:text-blue-300 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </nav> */}

        {/* Hero section */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slideUp">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Master NPTEL Courses
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-slideUp animation-delay-100">
              Transform your learning experience with AI-powered adaptive
              quizzes, detailed analytics, and personalized progress tracking.
            </p>

            <Link
              href="/quiz"
              className="group inline-block animate-fadeIn animation-delay-300"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-white shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 active:scale-95">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Start Learning Now
                </span>
              </button>
            </Link>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-24 text-left animate-slideUp animation-delay-500">
              {[
                {
                  icon: "📊",
                  title: "Progress Tracking",
                  text: "Visual analytics dashboard",
                },
                {
                  icon: "🧠",
                  title: "Adaptive Learning",
                  text: "AI-powered question bank",
                },
                {
                  icon: "🏆",
                  title: "Achievements",
                  text: "Earn badges & certificates",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-400/30 transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 backdrop-blur-lg border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
            © 2025 NPTEL Hub. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.15;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}
