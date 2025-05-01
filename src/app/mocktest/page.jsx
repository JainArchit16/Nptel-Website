"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  Timer,
  ChevronRight,
  ArrowLeft,
  Home,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MockTest() {
  // State variables
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedDuration, setSelectedDuration] = useState(null); // in minutes
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [quizResults, setQuizResults] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeResultsTab, setActiveResultsTab] = useState("all");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Animation variants for transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const getFilteredQuestions = () => {
    if (activeResultsTab === "all") return questions;
    if (activeResultsTab === "correct")
      return questions.filter(
        (q) =>
          quizResults?.correctAnswers[q.questionId] === answers[q.questionId]
      );
    if (activeResultsTab === "incorrect")
      return questions.filter(
        (q) =>
          quizResults?.correctAnswers[q.questionId] !== answers[q.questionId]
      );
    return questions;
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Mouse position effect for cursor trail
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Fetch available subjects on mount
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  // Timer effect for the quiz (step 3)
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

  // Format seconds as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Fetch questions from the API using the selected subject and question count.
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

  // When a duration is selected, set the timer, fetch questions, and move to the quiz interface.
  const startQuiz = async (duration) => {
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    await fetchQuestions();
    setStep(3);
  };

  // Record the answer for a given question.
  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Submit the quiz via our API which stores the quiz record and its user answers.
  const submitQuiz = async () => {
    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          week: 0, // Week 0 for mock tests
          answers: Object.entries(answers).map(
            ([questionId, selectedOption]) => ({
              questionId: Number(questionId),
              selectedOption,
            })
          ),
          userId: userId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setQuizResults(data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Error submitting quiz. Please try again.");
    }
  };

  // On submission, mark the quiz as submitted, call submitQuiz, and move to the results step.
  const handleSubmit = () => {
    setSubmitted(true);
    setStep(4);
    submitQuiz();
  };

  // Calculate the score locally as a fallback (or before quizResults is available).
  // If quizResults.score exists, it will be used instead.
  const calculateScore = () => {
    if (quizResults && quizResults.score !== undefined) {
      return quizResults.score.toFixed(2);
    }
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.questionId] === q.options[q.correctOption]) {
        correct++;
      }
    });
    return ((correct / questions.length) * 100).toFixed(2);
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const getProgressPercentage = () => {
    if (!questions.length) return 0;
    return (Object.keys(answers).length / questions.length) * 100;
  };

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
        <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                    Mock Test Challenge
                  </h1>
                  <p className="text-xl text-white/80">
                    Test your knowledge with a customized quiz
                  </p>
                </motion.div>

                <div className="mb-10">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Choose Your Subject
                  </h2>
                  <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((subject, index) => (
                      <motion.div
                        key={subject.subjectId}
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card
                          className={`bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer ${
                            selectedSubject === subject.subjectId
                              ? "border-blue-400 bg-blue-900/20"
                              : ""
                          }`}
                          onClick={() => setSelectedSubject(subject.subjectId)}
                        >
                          <CardContent className="p-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Brain className="w-10 h-10 text-cyan-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-2">
                              {subject.name}
                            </h2>
                            <p className="text-white/70 text-sm">
                              Test your knowledge
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 max-w-md mx-auto"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Quiz Settings
                  </h2>
                  <div className="mb-6">
                    <Label
                      htmlFor="question-count"
                      className="text-white mb-2 block"
                    >
                      Number of Questions
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        onClick={() =>
                          setQuestionCount(Math.max(1, questionCount - 1))
                        }
                      >
                        -
                      </Button>
                      <Input
                        id="question-count"
                        type="number"
                        value={questionCount}
                        min="1"
                        onChange={(e) =>
                          setQuestionCount(Number.parseInt(e.target.value) || 1)
                        }
                        className="bg-white/10 border-white/10 text-white text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        onClick={() => setQuestionCount(questionCount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (selectedSubject) setStep(2);
                      else toast.error("Please select a subject");
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Continue
                    </span>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <Link
                    href="/"
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Return to Home
                  </Link>
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white mr-4"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-3xl font-bold text-white">
                    Set Quiz Duration
                  </h1>
                </motion.div>

                <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[30, 60, 90].map((mins, index) => (
                    <motion.div
                      key={mins}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card
                        className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        onClick={() => startQuiz(mins)}
                      >
                        <CardContent className="p-6 flex flex-col items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Timer className="w-10 h-10 text-cyan-400 mb-4" />
                          <span className="text-4xl font-bold text-white mb-2">
                            {mins}
                          </span>
                          <span className="text-white/70">Minutes</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
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
                className="relative"
              >
                {/* Quiz Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block" />
                    <h1 className="text-xl font-medium text-white">
                      {
                        subjects.find((s) => s.subjectId === selectedSubject)
                          ?.name
                      }{" "}
                      <span className="text-white/60">Mock Test</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-white/70">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    <div className="w-32 md:w-48">
                      <Progress
                        value={getProgressPercentage()}
                        className="h-2 bg-white/10"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Question Navigation */}
                <div className="hidden md:flex mb-4 gap-2 flex-wrap">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentQuestionIndex === index
                          ? "default"
                          : answers[questions[index]?.questionId]
                          ? "outline"
                          : "ghost"
                      }
                      className={`w-10 h-10 p-0 ${
                        currentQuestionIndex === index
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          : answers[questions[index]?.questionId]
                          ? "border-blue-400/50 text-blue-400"
                          : "bg-white/5 text-white/70"
                      }`}
                      onClick={() => navigateToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                {/* Current Question */}
                <AnimatePresence mode="wait">
                  {questions.length > 0 && (
                    <motion.div
                      key={`question-${currentQuestionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 mb-6"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                              Question {currentQuestionIndex + 1}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-medium text-white">
                            {questions[
                              currentQuestionIndex
                            ]?.questionText.slice(12)}
                          </h3>
                        </div>
                      </div>

                      <RadioGroup
                        value={
                          answers[
                            questions[currentQuestionIndex]?.questionId
                          ] || ""
                        }
                        onValueChange={(value) =>
                          handleAnswerChange(
                            questions[currentQuestionIndex]?.questionId,
                            value
                          )
                        }
                        className="space-y-3"
                      >
                        {questions[currentQuestionIndex]?.options.map(
                          (option, i) => (
                            <div
                              key={i}
                              className={`flex items-center space-x-2 rounded-lg border border-white/10 p-4 transition-all duration-200 ${
                                answers[
                                  questions[currentQuestionIndex]?.questionId
                                ] === option
                                  ? "bg-blue-900/30 border-blue-400/50"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`option-${option}`}
                                className="text-blue-400"
                              />
                              <Label
                                htmlFor={`option-${option}`}
                                className="flex-1 cursor-pointer py-2 text-white"
                              >
                                {option}
                              </Label>
                            </div>
                          )
                        )}
                      </RadioGroup>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToQuestion(currentQuestionIndex + 1)
                      }
                      className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Submit Quiz
                      </span>
                    </Button>
                  )}
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
                {/* Results Header with Score */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 mb-4"
                  >
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {calculateScore()}%
                    </span>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Mock Test Completed!
                  </h2>
                  <p className="text-white/70">
                    {Number.parseFloat(calculateScore()) >= 70
                      ? "Great job! You've mastered this topic."
                      : "Keep practicing to improve your score."}
                  </p>
                </div>

                {/* Results List */}
                {/* <div className="space-y-4">
                  {questions.map((question, index) => {
                    const isCorrect =
                      answers[question.questionId] ===
                      question.options[question.correctOption];
                    return (
                      <motion.div
                        key={question.questionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-5 rounded-xl border ${
                          isCorrect
                            ? "bg-green-900/20 border-green-700/50"
                            : "bg-rose-900/20 border-rose-700/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex-shrink-0 mt-1 ${
                              isCorrect ? "text-green-400" : "text-rose-400"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle size={24} />
                            ) : (
                              <XCircle size={24} />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-medium text-white">
                              {question.questionText.slice(12)}
                            </h3>
                            <div className="mt-3 space-y-2">
                              <p
                                className={`text-sm ${
                                  isCorrect ? "text-green-400" : "text-rose-400"
                                }`}
                              >
                                Your answer:{" "}
                                {answers[question.questionId] || "Not answered"}
                              </p>
                              <p className="text-sm text-blue-400">
                                Correct answer:{" "}
                                {question.options[question.correctOption]}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div> */}
                {/* Results Tabs */}
                <Tabs defaultValue="incorrect">
                  <TabsList className="grid grid-cols-2 w-full mb-6 bg-white/5 backdrop-blur-md border border-white/10">
                    <TabsTrigger
                      value="correct"
                      className="w-full data-[state=active]:bg-green-600"
                    >
                      Correct
                    </TabsTrigger>
                    <TabsTrigger
                      value="incorrect"
                      className="w-full data-[state=active]:bg-rose-600"
                    >
                      Incorrect
                    </TabsTrigger>
                  </TabsList>

                  {/* Incorrect Answers Tab (includes Unanswered) */}
                  <TabsContent value="incorrect" className="mt-0">
                    <div className="space-y-4">
                      {questions
                        .filter((q) => {
                          const userAnswer = answers[q.questionId];
                          return (
                            !userAnswer ||
                            userAnswer !== q.options[q.correctOption]
                          );
                        })
                        .map((question, index) => (
                          <motion.div
                            key={question.questionId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-5 rounded-xl border bg-rose-900/20 border-rose-700/50"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1 text-rose-400">
                                <XCircle size={24} />
                              </div>
                              <div className="flex-grow">
                                <h3 className="text-lg font-medium text-white">
                                  {question.questionText.slice(12)}
                                </h3>
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm text-rose-400">
                                    {answers[question.questionId]
                                      ? `Your answer: ${
                                          answers[question.questionId]
                                        }`
                                      : "Not answered"}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    Correct answer:{" "}
                                    {question.options[question.correctOption]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* Correct Answers Tab */}
                  <TabsContent value="correct" className="mt-0">
                    <div className="space-y-4">
                      {questions
                        .filter(
                          (q) =>
                            answers[q.questionId] === q.options[q.correctOption]
                        )
                        .map((question, index) => (
                          <motion.div
                            key={question.questionId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-5 rounded-xl border bg-green-900/20 border-green-700/50"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1 text-green-400">
                                <CheckCircle size={24} />
                              </div>
                              <div className="flex-grow">
                                <h3 className="text-lg font-medium text-white">
                                  {question.questionText.slice(12)}
                                </h3>
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm text-green-400">
                                    Your answer: {answers[question.questionId]}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    Correct answer:{" "}
                                    {question.options[question.correctOption]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Navigation Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card
                      className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                      onClick={() => {
                        setStep(1);
                        setSubmitted(false);
                        setAnswers({});
                        setQuizResults(null);
                        setCurrentQuestionIndex(0);
                      }}
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                        <Home className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          New Mock Test
                        </h3>
                        <p className="text-white/70 text-center">
                          Start a new mock test with different settings
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/">
                      <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <ChevronRight className="w-10 h-10 text-blue-400 mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">
                            Return Home
                          </h3>
                          <p className="text-white/70 text-center">
                            Go back to the main dashboard
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-6 backdrop-blur-lg border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-white/40">
            © 2025 NPTEL Hub. Developed by Daksh Baweja and Archit Jain
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
