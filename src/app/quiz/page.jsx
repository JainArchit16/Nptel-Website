"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QuizPage from "./quizpage";
import { motion } from "framer-motion";

export default function SubjectWeekSelector() {
  const { data: session } = useSession();
  const id = session?.user?.id;
  console.log(id);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  // Fetch subjects
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedWeek(null); // Reset week selection
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Choose Your Quiz
          <span className="block mt-2 text-lg font-normal text-gray-600">
            Select a subject and week to begin
          </span>
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <motion.button
                key={subject.subjectId}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubjectChange(subject.subjectId)}
                className={`p-4 rounded-xl transition-all ${
                  selectedSubject === subject.subjectId
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <span className="font-medium">{subject.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Weeks</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[...Array(12).keys()].map((week) => (
                <motion.button
                  key={week + 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWeekChange(week + 1)}
                  className={`p-3 rounded-lg transition-all ${
                    selectedWeek === week + 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Week {week + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-12">
          {selectedSubject && selectedWeek ? (
            <QuizPage
              params={{ subjectId: selectedSubject, week: selectedWeek, id }}
            />
          ) : (
            <p className="text-center text-gray-500">
              {selectedSubject
                ? "Select a week to start the quiz"
                : "Choose a subject to continue"}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
