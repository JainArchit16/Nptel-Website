"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ArrowLeft,
  Brain,
  Timer,
  Home,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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
  const [bookmarked, setBookmarked] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeResultsTab, setActiveResultsTab] = useState("all");
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

  useEffect(() => {
    if (userId) {
      fetch(`/api/bookmarks?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          // Assume the API returns an array of question IDs that are bookmarked
          const bookmarkMap = data.reduce((acc, bookmark) => {
            acc[bookmark.questionId] = true;
            return acc;
          }, {});
          setBookmarked(bookmarkMap);
        })
        .catch(console.error);
    }
  }, [userId]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Fetch subjects
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedWeek) {
      fetch(`/api/subjects/${selectedSubject}/weeks/${selectedWeek}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const getQuestionNumber = (text) => {
              const match = text.match(/\bQUESTION\s*(\d+)/i);
              return match ? parseInt(match[1], 10) : Infinity;
            };
            data.sort(
              (a, b) =>
                getQuestionNumber(a.questionText) -
                getQuestionNumber(b.questionText)
            );
            setQuestions(data);
          }
        })
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

  const handleBookmark = async (questionId) => {
    // Check if the question is currently bookmarked
    const isBookmarked = bookmarked[questionId];

    try {
      if (isBookmarked) {
        // Remove bookmark
        const res = await fetch("/api/bookmark", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, questionId }),
        });
        if (res.ok) {
          setBookmarked((prev) => ({ ...prev, [questionId]: false }));
          toast.success("Bookmark removed");
        }
      } else {
        // Add bookmark
        const res = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, questionId }),
        });
        if (res.ok) {
          setBookmarked((prev) => ({ ...prev, [questionId]: true }));
          toast.success("Bookmark added");
        }
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      toast.error("Failed to update bookmark");
    }
  };

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

  const resetQuiz = () => {
    setSelectedSubject(null);
    setSelectedWeek(null);
    setSelectedDuration(null);
    setQuestions([]);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    setTimeLeft(null);
    setCurrentQuestionIndex(0);
  };

  const nextQuiz = () => {
    // Keep the same subject, increment week if possible
    let nextWeek = selectedWeek;
    if (selectedWeek < 12) {
      nextWeek = selectedWeek + 1;
    } else {
      // If we're at week 12, cycle back to week 1
      nextWeek = 1;
    }

    setSelectedWeek(nextWeek);
    setQuestions([]);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    setTimeLeft(selectedDuration * 60);
    setCurrentQuestionIndex(0);
  };

  const getProgressPercentage = () => {
    if (!questions.length) return 0;
    return (Object.keys(answers).length / questions.length) * 100;
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
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
    if (activeResultsTab === "bookmarked")
      return questions.filter((q) => bookmarked[q.questionId]);

    return questions;
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                    Knowledge Quest
                  </h1>
                  <p className="text-xl text-white/80">
                    Choose your subject and embark on a learning journey
                  </p>
                </motion.div>

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
                        className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        onClick={() => setSelectedSubject(subject.subjectId)}
                      >
                        <CardContent className="p-6 cursor-pointer relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Brain className="w-10 h-10 text-cyan-400 mb-4" />
                          <h2 className="text-2xl font-semibold text-white mb-2">
                            {subject.name}
                          </h2>
                          <p className="text-white/70 text-sm">
                            Explore and test your knowledge
                          </p>
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-cyan-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white mr-4"
                    onClick={() => setSelectedSubject(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-3xl font-bold text-white">
                    Select Week
                    <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      {
                        subjects.find((s) => s.subjectId === selectedSubject)
                          ?.name
                      }
                    </Badge>
                  </h1>
                </motion.div>

                <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(12).keys()].map((week, index) => (
                    <motion.div
                      key={week}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card
                        className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        onClick={() => setSelectedWeek(week + 1)}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                          <span className="text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                            {week + 1}
                          </span>
                          <span className="text-sm text-white/70 mt-1">
                            Week
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white mr-4"
                    onClick={() => setSelectedWeek(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-3xl font-bold text-white">
                    Set Quiz Duration
                  </h1>
                </motion.div>

                <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[5, 10, 15].map((mins, index) => (
                    <motion.div
                      key={mins}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card
                        className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        onClick={() => {
                          setSelectedDuration(mins);
                          setTimeLeft(mins * 60);
                        }}
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

            {/* Quiz Interface */}
            {selectedDuration && !quizSubmitted && (
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
                      <span className="text-white/60">Week {selectedWeek}</span>
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
                          <h3 className="text-xl font-medium text-white whitespace-pre-line">
                            {questions[
                              currentQuestionIndex
                            ]?.questionText.substring(12)}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleBookmark(
                              questions[currentQuestionIndex]?.questionId
                            )
                          }
                          className="text-white/60 hover:text-amber-400"
                        >
                          {bookmarked[
                            questions[currentQuestionIndex]?.questionId
                          ] ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      <RadioGroup
                        value={
                          answers[
                            questions[currentQuestionIndex]?.questionId
                          ] || ""
                        }
                        onValueChange={(value) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [questions[currentQuestionIndex]?.questionId]:
                              value,
                          }))
                        }
                        className="space-y-3"
                      >
                        {questions[currentQuestionIndex]?.options.map(
                          (option) => (
                            <div
                              key={option}
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

            {/* Results Screen */}
            {quizSubmitted && (
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
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {quizResults?.score?.toFixed(0)}%
                    </span>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Quiz Completed!
                  </h2>
                  <p className="text-white/70">
                    {quizResults?.score >= 70
                      ? "Great job! You've mastered this topic."
                      : "Keep practicing to improve your score."}
                  </p>
                </div>

                {/* Results Tabs */}
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={setActiveResultsTab}
                >
                  <TabsList className="grid grid-cols-4 mb-6 bg-white/5 backdrop-blur-md border border-white/10">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500"
                    >
                      All Questions
                    </TabsTrigger>
                    <TabsTrigger
                      value="correct"
                      className="data-[state=active]:bg-green-600"
                    >
                      Correct
                    </TabsTrigger>
                    <TabsTrigger
                      value="incorrect"
                      className="data-[state=active]:bg-rose-600"
                    >
                      Incorrect
                    </TabsTrigger>
                    <TabsTrigger
                      value="bookmarked"
                      className="data-[state=active]:bg-amber-600"
                    >
                      Bookmarked
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-4">
                      {questions.map((question, index) => {
                        const isCorrect =
                          quizResults?.correctAnswers[question.questionId] ===
                          answers[question.questionId];
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
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium text-white">
                                    {question.questionText.substring(12)}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleBookmark(question.questionId)
                                    }
                                    className="text-white/60 hover:text-amber-400 ml-2"
                                  >
                                    {bookmarked[question.questionId] ? (
                                      <BookmarkCheck className="w-5 h-5 text-amber-400" />
                                    ) : (
                                      <Bookmark className="w-5 h-5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="mt-3 space-y-2">
                                  <p
                                    className={`text-sm ${
                                      isCorrect
                                        ? "text-green-400"
                                        : "text-rose-400"
                                    }`}
                                  >
                                    Your answer:{" "}
                                    {answers[question.questionId] ||
                                      "Not answered"}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    Correct answer:{" "}
                                    {
                                      quizResults?.correctAnswers[
                                        question.questionId
                                      ]
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="correct" className="mt-0">
                    <div className="space-y-4">
                      {questions
                        .filter(
                          (q) =>
                            quizResults?.correctAnswers[q.questionId] ===
                            answers[q.questionId]
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
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium text-white">
                                    {question.questionText.substring(12)}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleBookmark(question.questionId)
                                    }
                                    className="text-white/60 hover:text-amber-400 ml-2"
                                  >
                                    {bookmarked[question.questionId] ? (
                                      <BookmarkCheck className="w-5 h-5 text-amber-400" />
                                    ) : (
                                      <Bookmark className="w-5 h-5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm text-green-400">
                                    Your answer: {answers[question.questionId]}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    Correct answer:{" "}
                                    {
                                      quizResults?.correctAnswers[
                                        question.questionId
                                      ]
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="incorrect" className="mt-0">
                    <div className="space-y-4">
                      {questions
                        .filter(
                          (q) =>
                            quizResults?.correctAnswers[q.questionId] !==
                            answers[q.questionId]
                        )
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
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium text-white">
                                    {question.questionText.substring(12)}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleBookmark(question.questionId)
                                    }
                                    className="text-white/60 hover:text-amber-400 ml-2"
                                  >
                                    {bookmarked[question.questionId] ? (
                                      <BookmarkCheck className="w-5 h-5 text-amber-400" />
                                    ) : (
                                      <Bookmark className="w-5 h-5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm text-rose-400">
                                    Your answer:{" "}
                                    {answers[question.questionId] ||
                                      "Not answered"}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    Correct answer:{" "}
                                    {
                                      quizResults?.correctAnswers[
                                        question.questionId
                                      ]
                                    }
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
                      onClick={resetQuiz}
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                        <Home className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Return to Subjects
                        </h3>
                        <p className="text-white/70 text-center">
                          Choose a different subject to explore new topics
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card
                      className="bg-white/5 backdrop-blur-md border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                      onClick={nextQuiz}
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                        <ChevronRight className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Next Quiz
                        </h3>
                        <p className="text-white/70 text-center">
                          Continue with the next week in{" "}
                          {
                            subjects.find(
                              (s) => s.subjectId === selectedSubject
                            )?.name
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-6 backdrop-blur-lg border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-white/40">
            © 2025 NPTEL Hub. Developed by Daksh Baweja and Archit Jain.
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
