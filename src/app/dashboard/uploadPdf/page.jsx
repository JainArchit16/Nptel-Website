"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function UploadForm() {
  const [fileData, setFileData] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);

        // Validate array structure
        if (!Array.isArray(json)) {
          throw new Error("JSON should be an array of questions");
        }

        // Validate each question object
        const isValid = json.every(
          (q) =>
            q.hasOwnProperty("subject") &&
            q.hasOwnProperty("week") &&
            q.hasOwnProperty("questionText") &&
            q.hasOwnProperty("options") &&
            q.hasOwnProperty("correctOption")
        );

        if (!isValid) {
          throw new Error("Invalid question structure in JSON");
        }

        setFileData(json);
        setMessage("");
      } catch (error) {
        console.error("Invalid JSON file:", error);
        setMessage(error.message);
        setFileData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileData) {
      setMessage("Please select a valid JSON file.");
      return;
    }
    const id = toast.loading("Uploading");
    try {
      const res = await fetch("/api/quiz/uploadQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });

      const data = await res.json();
      toast.dismiss(id);
      if (res.ok) {
        setMessage(`Upload successful! Processed ${fileData.length} questions`);
        setFileData(null);
        toast.success("Uploaded");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Error");
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply opacity-50 animate-blob"></div>
      <div className="absolute -top-48 right-0 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-24 -right-24 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-2xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          📚 Course Content Upload
          <span className="block text-xl font-normal text-gray-600 mt-2">
            Upload questions in JSON format
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Questions File
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="application/json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="w-full px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl group-hover:border-purple-400 transition-all flex flex-col items-center justify-center space-y-2">
                <svg
                  className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-gray-600 text-sm">
                  {fileData
                    ? `Selected: ${fileData.name}`
                    : "Drag & drop or click to upload JSON"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
          >
            🚀 Upload Questions
          </button>

          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("successful")
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              } flex items-center space-x-3`}
            >
              <span
                className={`text-2xl ${
                  message.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message.includes("successful") ? "✅" : "⚠️"}
              </span>
              <span
                className={`font-medium ${
                  message.includes("successful")
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {message}
              </span>
            </div>
          )}
        </form>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite linear;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
