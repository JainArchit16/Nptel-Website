"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MockTest() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedDuration, setSelectedDuration] = useState(null); // in minutes
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  // Animation variants for transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch subjects on mount
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  // Timer effect: countdown only during the quiz (step 3)
  useEffect(() => {
    if (step === 3 && !submitted && selectedDuration && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (step === 3 && timeLeft === 0 && !submitted) {
      toast.error("Time's up! Quiz auto-submitted");
      handleSubmit();
    }
  }, [step, submitted, selectedDuration, timeLeft]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Fetch questions from the API using the selected subject and question count.
  // (Your API should return a randomized set of questions.)
  const fetchQuestions = async () => {
    if (!selectedSubject) return;
    try {
      const res = await fetch(
        `/api/mocktest?subjectId=${selectedSubject}&limit=${questionCount}`
      );
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // When the user selects a duration, set the timer and fetch questions, then proceed to the quiz.
  const startQuiz = async (duration) => {
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    await fetchQuestions();
    setStep(3);
  };

  // Record the answer for a question.
  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // On submission, mark the quiz as submitted and move to results.
  const handleSubmit = () => {
    setSubmitted(true);
    setStep(4);
  };

  // Calculate quiz score (percentage of correct answers)
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.questionId] === q.options[q.correctOption]) {
        correct++;
      }
    });
    return ((correct / questions.length) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Subject Selection & Question Count */}
          {step === 1 && (
            <motion.div
              key="subject-selection"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject.subjectId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(subject.subjectId)}
                    className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all ${
                      selectedSubject === subject.subjectId
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <span className="text-xl font-medium text-gray-800">
                      {subject.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-8">
                <label className="text-gray-700 font-medium">
                  Number of Questions:
                  <input
                    type="number"
                    value={questionCount}
                    min="1"
                    onChange={(e) =>
                      setQuestionCount(parseInt(e.target.value) || 1)
                    }
                    className="ml-2 p-2 border rounded w-20"
                  />
                </label>
              </div>
              <button
                onClick={() => {
                  if (selectedSubject) setStep(2);
                  else toast.error("Please select a subject");
                }}
                className="mt-8 inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <motion.div
              key="time-selection"
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
                    onClick={() => startQuiz(mins)}
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

          {/* Step 3: Quiz Interface */}
          {step === 3 && !submitted && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-lg">
                <div className="flex items-center gap-2 text-red-500">
                  <FiClock className="w-6 h-6" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  {
                    subjects.find(
                      (s) => s.subjectId === selectedSubject
                    )?.name
                  }
                </h1>
              </div>
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-blue-600 font-medium">
                        #{index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {/* Remove the first 3 characters from the question text */}
                        {q.questionText.slice(3)}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {q.options.map((option, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            answers[q.questionId] === option
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.questionId}`}
                            value={option}
                            onChange={() =>
                              handleAnswerChange(q.questionId, option)
                            }
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && submitted && (
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
                    {calculateScore()}%
                  </span>
                </motion.div>
                <p className="mt-4 text-gray-600">Your Overall Score</p>
              </div>
              <div className="space-y-6">
                {questions.map((q) => {
                  const isCorrect =
                    answers[q.questionId] === q.options[q.correctOption];
                  return (
                    <motion.div
                      key={q.questionId}
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
                            {q.questionText.slice(3)}
                          </h3>
                          <div className="mt-3 space-y-2">
                            <p
                              className={`text-sm ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              Your answer:{" "}
                              {answers[q.questionId] || "Not answered"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Correct answer: {q.options[q.correctOption]}
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
