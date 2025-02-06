"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "../../../components/Spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiEdit, FiSave } from "react-icons/fi";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;
  const profileGender = session?.user?.gender;
  const profileCollege = session?.user?.college;

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [gender, setGender] = useState(profileGender || "");
  const [college, setCollege] = useState(profileCollege || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async (userId) => {
      if (!userId) {
        return;
      }

      try {
        const res = await fetch(`/api/quiz/totalMarks/${userId}`);
        if (res.status === 200) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user quizzes when session is available
    if (session?.user?.id) {
      fetchQuizDetails(session.user.id);
    }
  }, [session]);

  const handleSave = async () => {
    const id = toast.loading("Saving");
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          gender,
          college,
        }),
      });
      toast.dismiss(id);
      if (res.status === 200) {
        toast.success("Saved");
        setIsEditing(false);
        // Optionally, you can update the session or refetch user data here
      }
    } catch (error) {
      toast.dismiss(id);
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply opacity-50 animate-blob"></div>
      <div className="absolute -top-48 right-0 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-24 -right-24 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-purple-100/20 rounded-full -top-48 -left-48 mix-blend-overlay animate-pulse-slow" />
        <div className="absolute w-96 h-96 bg-blue-100/20 rounded-full -bottom-48 -right-48 mix-blend-overlay animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>

          <div className="p-8 grid md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name}`}
                  alt="User avatar"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiEdit className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {profileName}
                </h2>
                <p className="text-gray-600">{profileEmail}</p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setIsEditing(true);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      setIsEditing(true);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {isEditing && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSave}
                  className="flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  <FiSave className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quiz Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Quiz History</h2>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner loading={loading} />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">
                  No quiz attempts yet. Let's get started!
                </p>
                <Link
                  href="/quiz"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                >
                  Take a Quiz →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Subject",
                        "Week",
                        "Score",
                        "Accuracy",
                        "Attempted On",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr
                        key={quiz.quizId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {quiz.subject?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          Week {quiz.week}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {quiz.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${quiz.accuracy}%` }}
                              />
                            </div>
                            <span>{quiz.accuracy}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {quiz.attemptTime
                            ? new Date(quiz.attemptTime).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                  hour12: true,
                                }
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
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
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
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
};

export default ProfilePage;
