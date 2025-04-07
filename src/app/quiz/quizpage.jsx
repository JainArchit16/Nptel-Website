"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function QuizPage({ params }) {
  const { subjectId, week, id } = params;
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    console.log("Subject ID:", subjectId, "Week:", week, "User id", id);
    fetch(`/api/subjects/${subjectId}/weeks/${week}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch questions");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setError(error.message);
      });
  }, [subjectId, week]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: Number(subjectId),
          week: Number(week),
          answers: Object.entries(answers).map(
            ([questionId, selectedOption]) => ({
              questionId: Number(questionId),
              selectedOption,
            })
          ),
          userId: id, // Add a dummy userId for now
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit quiz");
      }

      const results = await response.json();
      setQuizResults(results);
      setQuizSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError(error.message);
    }
  };

  const renderQuizContent = () => {
    if (quizSubmitted) {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block bg-blue-100 p-6 rounded-full"
            >
              <span className="text-4xl font-bold text-blue-600">
                {quizResults.score.toFixed(2)}%
              </span>
            </motion.div>
            <p className="mt-4 text-gray-600">Your Overall Score</p>
          </div>

          <div className="space-y-6">
            {questions.map((question) => {
              const isCorrect =
                quizResults.correctAnswers[question.questionId] ===
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
                        {question.questionText.substring(10)}
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
                          {quizResults.correctAnswers[question.questionId]}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-blue-600 font-medium">#{index + 1}</span>
                <h3 className="text-lg font-medium text-gray-900">
                  {question.questionText.substring(10)}
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
                        handleOptionChange(question.questionId, option)
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Submit Quiz
          </button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {`Subject ${subjectId} • Week ${week}`}
        </h1>
        <div className="flex justify-center items-center gap-2 text-gray-600">
          <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
          <span>{questions.length} Questions</span>
        </div>
      </motion.div>

      {error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : questions.length > 0 ? (
        renderQuizContent()
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-pulse">Loading questions...</div>
        </div>
      )}
    </div>
  );
}
