"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, BookmarkX, Book, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetch(`/api/bookmarksBySubject?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          const groups = data.reduce((acc, bookmark) => {
            const subjectName = bookmark.question.subject.name;
            if (!acc[subjectName]) {
              acc[subjectName] = [];
            }
            acc[subjectName].push(bookmark.question);
            return acc;
          }, {});
          setGroupedBookmarks(groups);

          const subjects = Object.keys(groups);
          if (subjects.length > 0) {
            setActiveTab(subjects[0]);
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          toast.error("Error fetching bookmarks");
        });
    }
  }, [userId]);

  const handleRemoveBookmark = async (questionId) => {
    try {
      const response = await fetch("/api/bookmark", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }

      toast.success("Bookmark removed");

      setGroupedBookmarks((prev) => {
        const updatedGroups = { ...prev };
        for (const subject in updatedGroups) {
          updatedGroups[subject] = updatedGroups[subject].filter(
            (question) => question.questionId !== questionId
          );

          if (updatedGroups[subject].length === 0) {
            delete updatedGroups[subject];
          }
        }

        const subjects = Object.keys(updatedGroups);
        if (subjects.length > 0 && !subjects.includes(activeTab)) {
          setActiveTab(subjects[0]);
        } else if (subjects.length === 0) {
          setActiveTab("");
        }

        return updatedGroups;
      });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          Loading your bookmarks...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and manage your bookmarked questions.
          </p>
          <Button size="lg">Sign In</Button>
        </div>
      </div>
    );
  }

  if (Object.keys(groupedBookmarks).length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12 tracking-tight">
          Your Bookmarks
        </h1>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl">
          <Book className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Start exploring questions and bookmark the ones you want to revisit
            later.
          </p>
          <Button size="lg" asChild>
            <a href="/quiz">Explore Questions</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Your Bookmarks</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm py-1 px-3">
              <Bookmark className="h-3.5 w-3.5 mr-1" />
              {Object.values(groupedBookmarks).flat().length} Questions
            </Badge>
            <Badge variant="outline" className="text-sm py-1 px-3">
              <Book className="h-3.5 w-3.5 mr-1" />
              {Object.keys(groupedBookmarks).length} Subjects
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex flex-wrap h-auto p-1 gap-2">
            {Object.keys(groupedBookmarks).map((subject) => (
              <TabsTrigger
                key={subject}
                value={subject}
                className="py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {subject}
                <Badge variant="secondary" className="ml-2">
                  {groupedBookmarks[subject].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(groupedBookmarks).map((subject) => (
            <TabsContent key={subject} value={subject} className="space-y-4">
              {groupedBookmarks[subject].map((question, index) => (
                <motion.div
                  key={question.questionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-xl font-semibold leading-tight">
                          {question.questionText}
                        </CardTitle>
                        {confirmDelete === question.questionId ? (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                            <span className="text-sm text-muted-foreground">
                              Remove?
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleRemoveBookmark(question.questionId)
                              }
                            >
                              Yes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmDelete(null)}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() =>
                              setConfirmDelete(question.questionId)
                            }
                          >
                            <BookmarkX className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctOption
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium flex-shrink-0 ${
                                  optionIndex === question.correctOption
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <p
                                className={`text-sm ${
                                  optionIndex === question.correctOption
                                    ? "font-medium text-green-800"
                                    : "text-gray-700"
                                }`}
                              >
                                {option}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
