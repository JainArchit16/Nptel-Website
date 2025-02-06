// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import QuizPage from "./quizpage";
// import { motion } from "framer-motion";

// export default function SubjectWeekSelector() {
//   const { data: session } = useSession();
//   const id = session?.user?.id;
//   console.log(id);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedWeek, setSelectedWeek] = useState(null);

//   // Fetch subjects
//   useEffect(() => {
//     fetch("/api/subjects")
//       .then((res) => res.json())
//       .then((data) => setSubjects(data))
//       .catch((error) => console.error("Error fetching subjects:", error));
//   }, []);

//   const handleSubjectChange = (subjectId) => {
//     setSelectedSubject(subjectId);
//     setSelectedWeek(null); // Reset week selection
//   };

//   const handleWeekChange = (week) => {
//     setSelectedWeek(week);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
//           Choose Your Quiz
//           <span className="block mt-2 text-lg font-normal text-gray-600">
//             Select a subject and week to begin
//           </span>
//         </h1>

//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Subjects</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {subjects.map((subject) => (
//               <motion.button
//                 key={subject.subjectId}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleSubjectChange(subject.subjectId)}
//                 className={`p-4 rounded-xl transition-all ${
//                   selectedSubject === subject.subjectId
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-gray-100 hover:bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 <span className="font-medium">{subject.name}</span>
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {selectedSubject && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white rounded-2xl shadow-lg p-6"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">Weeks</h2>
//             <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
//               {[...Array(12).keys()].map((week) => (
//                 <motion.button
//                   key={week + 1}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleWeekChange(week + 1)}
//                   className={`p-3 rounded-lg transition-all ${
//                     selectedWeek === week + 1
//                       ? "bg-blue-600 text-white shadow-lg"
//                       : "bg-gray-100 hover:bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   Week {week + 1}
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         <div className="mt-12">
//           {selectedSubject && selectedWeek ? (
//             <QuizPage
//               params={{ subjectId: selectedSubject, week: selectedWeek, id }}
//             />
//           ) : (
//             <p className="text-center text-gray-500">
//               {selectedSubject
//                 ? "Select a week to start the quiz"
//                 : "Choose a subject to continue"}
//             </p>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function QuizFlow() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch subjects
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  // Fetch questions when week selected
  useEffect(() => {
    if (selectedSubject && selectedWeek) {
      fetch(`/api/subjects/${selectedSubject}/weeks/${selectedWeek}`)
        .then((res) => res.json())
        .then((data) => Array.isArray(data) && setQuestions(data))
        .catch(console.error);
    }
  }, [selectedSubject, selectedWeek]);

  // Timer effect
  useEffect(() => {
    if (!quizSubmitted && selectedDuration && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      toast.error("Time's up! Quiz auto-submitted");
      handleSubmit();
    }
  }, [quizSubmitted, timeLeft, selectedDuration]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          week: selectedWeek,
          answers: Object.entries(answers).map(([id, option]) => ({
            questionId: Number(id),
            selectedOption: option,
          })),
          userId,
        }),
      });
      const results = await res.json();
      setQuizResults(results);
      setQuizSubmitted(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed!");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Subject Selection */}
          {!selectedSubject && (
            <motion.div
              key="subject"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Choose Your Subject
                <span className="block mt-4 text-lg font-normal text-gray-600">
                  Start your learning journey
                </span>
              </h1>

              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject.subjectId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(subject.subjectId)}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-xl font-medium text-gray-800">
                      {subject.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Week Selection */}
          {selectedSubject && !selectedWeek && (
            <motion.div
              key="week"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Select Week
                <span className="block mt-4 text-lg font-normal text-gray-600">
                  Subject:{" "}
                  {subjects.find((s) => s.subjectId === selectedSubject)?.name}
                </span>
              </h1>

              <motion.div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[...Array(12).keys()].map((week) => (
                  <motion.button
                    key={week}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedWeek(week + 1)}
                    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Week {week + 1}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Timer Selection */}
          {selectedWeek && !selectedDuration && (
            <motion.div
              key="timer"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Set Quiz Duration
                <span className="block mt-4 text-lg font-normal text-gray-600">
                  Choose your time limit
                </span>
              </h1>

              <div className="grid grid-cols-3 gap-4">
                {[5, 10, 15].map((mins) => (
                  <motion.button
                    key={mins}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDuration(mins);
                      setTimeLeft(mins * 60);
                    }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-xl font-medium text-gray-800">
                      {mins} Minutes
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quiz Interface */}
          {selectedDuration && !quizSubmitted && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Quiz Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 text-red-500">
                  <FiClock className="w-6 h-6" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  {subjects.find((s) => s.subjectId === selectedSubject)?.name}{" "}
                  - Week {selectedWeek}
                </h1>
              </motion.div>

              {/* Questions */}
              <motion.div className="space-y-6">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-blue-600 font-medium">
                        #{index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {question.questionText}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            answers[question.questionId] === option
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.questionId}`}
                            value={option}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.questionId]: option,
                              }))
                            }
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <motion.div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Quiz
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Results Screen */}
          {quizSubmitted && (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block bg-blue-100 p-6 rounded-full"
                >
                  <span className="text-4xl font-bold text-blue-600">
                    {quizResults?.score.toFixed(2)}%
                  </span>
                </motion.div>
                <p className="mt-4 text-gray-600">Your Overall Score</p>
              </div>

              <div className="space-y-6">
                {questions.map((question) => {
                  const isCorrect =
                    quizResults?.correctAnswers[question.questionId] ===
                    answers[question.questionId];
                  return (
                    <motion.div
                      key={question.questionId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 mt-1 ${
                            isCorrect ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isCorrect ? (
                            <FiCheckCircle size={24} />
                          ) : (
                            <FiXCircle size={24} />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-medium text-gray-900">
                            {question.questionText}
                          </h3>
                          <div className="mt-3 space-y-2">
                            <p
                              className={`text-sm ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              Your answer:{" "}
                              {answers[question.questionId] || "Not answered"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Correct answer:{" "}
                              {quizResults?.correctAnswers[question.questionId]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
