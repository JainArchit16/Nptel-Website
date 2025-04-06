"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-purple-500/20 rounded-full -top-96 -left-96 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full -bottom-64 -right-64 mix-blend-screen animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute w-[400px] h-[400px] bg-pink-500/20 rounded-full top-1/2 left-1/2 mix-blend-screen animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Cursor trail effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero section */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Master NPTEL
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Embark on an exhilarating learning journey with AI-powered
              quizzes, stunning analytics, and personalized progress tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            >
              <Link href="/quiz" className="group inline-block">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] active:scale-95">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                    Begin Your Adventure
                  </span>
                </button>
              </Link>
            </motion.div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
              {[
                {
                  icon: "📊",
                  title: "Progress Tracking",
                  text: "Visualize your growth with stunning analytics",
                },
                {
                  icon: "🧠",
                  title: "Adaptive Learning",
                  text: "AI-powered questions tailored just for you",
                },
                {
                  icon: "🏆",
                  title: "Achievements",
                  text: "Unlock badges and showcase your expertise",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-blue-400/50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] group"
                >
                  <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.text}</p>
                </motion.div>
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
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
}
