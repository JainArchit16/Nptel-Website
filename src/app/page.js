"use client";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-900 text-white">
      {/* CSS 3D Cube Background */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center cube-container">
        <div className="cube">
          <div className="cube-face cube-face-front"></div>
          <div className="cube-face cube-face-back"></div>
          <div className="cube-face cube-face-right"></div>
          <div className="cube-face cube-face-left"></div>
          <div className="cube-face cube-face-top"></div>
          <div className="cube-face cube-face-bottom"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}

        {/* Hero Section */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold animate-fadeIn">
            Empower Your Learning Journey
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl animate-textPulse">
            Dive into interactive quizzes tailored for NPTEL courses. Master
            concepts, track your progress, and challenge yourself in a dynamic,
            visually stunning environment.
          </p>
          <Link href="/quiz">
            <button className="mt-8 px-8 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-full shadow-xl transform hover:scale-105 transition-transform duration-300 animate-bounce">
              Start Quiz
            </button>
          </Link>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center">
          <p className="text-sm">&copy; 2025 QuizNPTEL. All rights reserved.</p>
        </footer>
      </div>

      {/* Custom CSS Animations & Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes textPulse {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-textPulse {
          animation: textPulse 1.5s ease-out forwards;
        }

        /* Cube Container with perspective */
        .cube-container {
          perspective: 800px;
        }
        /* Cube styling */
        .cube {
          position: relative;
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
          animation: rotateCube 10s infinite linear;
        }
        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .cube-face-front {
          transform: translateZ(100px);
        }
        .cube-face-back {
          transform: rotateY(180deg) translateZ(100px);
        }
        .cube-face-right {
          transform: rotateY(90deg) translateZ(100px);
        }
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(100px);
        }
        .cube-face-top {
          transform: rotateX(90deg) translateZ(100px);
        }
        .cube-face-bottom {
          transform: rotateX(-90deg) translateZ(100px);
        }
        @keyframes rotateCube {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }
          to {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}
