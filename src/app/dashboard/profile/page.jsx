"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiCheckSquare,
  FiAward,
  FiActivity,
} from "react-icons/fi";

// Import all our components
import StatCard from "../../../components/dashboard/StatCard";
import PerformanceChart from "../../../components/dashboard/PerformanceChart";
import SubjectMasteryChart from "../../../components/dashboard/SubjectMasteryChart";
import EnhancedQuizTable from "../../../components/dashboard/EnhancedQuizTable";
import ProfileEditor from "../../../components/dashboard/ProfileEditor";
import RecentActivity from "../../../components/dashboard/RecentActivity"; // New
import SkeletonLoader from "../../../components/dashboard/SkeletonLoader"; // New

const DashboardPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // States for our data
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [quizzes, setQuizzes] = useState(null);

  // **THE FIX FOR THE RELOADING LOOP IS HERE**
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch if the user session is available and we don't have data yet
      if (session?.user?.id && !stats) {
        try {
          // Promise.all fetches all data in parallel for speed
          const [statsRes, performanceRes, subjectsRes, quizzesRes] =
            await Promise.all([
              fetch("/api/dashboard/stats"),
              fetch("/api/dashboard/performance"),
              fetch("/api/dashboard/subjects"),
              fetch(`/api/quiz/totalMarks/${session.user.id}`),
            ]);

          setStats(await statsRes.json());
          setPerformanceData(await performanceRes.json());
          setSubjectData(await subjectsRes.json());
          setQuizzes(await quizzesRes.json());
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          // Optionally, set an error state here to show a message to the user
        } finally {
          setIsLoading(false);
        }
      } else if (!session) {
        // If there's no session after a while, stop loading
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchDashboardData();
  }, [session, stats]); // The effect now depends on `session` and `stats`

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your progress snapshot. Keep up the great work! ✨
          </p>
        </div>

        {/* Main Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <>
                  <SkeletonLoader className="h-36" />
                  <SkeletonLoader className="h-36" />
                  <SkeletonLoader className="h-36" />
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants}>
                    <StatCard
                      title="Total Quizzes"
                      value={stats?.totalQuizzes || 0}
                      icon={<FiCheckSquare className="w-6 h-6 text-white" />}
                      color="from-blue-500 to-blue-400"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <StatCard
                      title="Avg. Accuracy"
                      value={`${stats?.overallAverageAccuracy || 0}%`}
                      icon={<FiTrendingUp className="w-6 h-6 text-white" />}
                      color="from-green-500 to-green-400"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <StatCard
                      title="Best Subject"
                      value={stats?.bestSubject || "N/A"}
                      icon={<FiAward className="w-6 h-6 text-white" />}
                      color="from-purple-500 to-purple-400"
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Performance Chart */}
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <SkeletonLoader className="h-[350px]" />
              ) : (
                <PerformanceChart data={performanceData || []} />
              )}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <SkeletonLoader className="h-80" />
              ) : (
                <ProfileEditor session={session} />
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <SkeletonLoader className="h-64" />
              ) : (
                <RecentActivity quizzes={quizzes || []} />
              )}
            </motion.div>
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
                          {quiz.week === 0 ? "Mock Test" : `Week ${quiz.week}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {quiz.score}/
                            {Math.round(
                              (quiz.score * 100) / (quiz.accuracy || 1)
                            )}
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
    </div>
  );
};

export default DashboardPage;
