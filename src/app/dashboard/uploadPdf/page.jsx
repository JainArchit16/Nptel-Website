"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [week, setWeek] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);

  // Fetch existing subjects from the database
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const id = toast.loading("Uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("week", week);

      // If it's a new subject, send the subject name
      if (isNewSubject) {
        formData.append("newSubjectName", newSubjectName);
      } else {
        formData.append("subjectId", subjectId);
      }
      console.log("hello");
      const response = await fetch("/api/quiz/questions", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || result.error);
      toast.dismiss(id);
      toast.success("Uploaded");
    } catch (error) {
      toast.error(error);
      setMessage("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r  flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105 from-white via-red-100 to-red-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-fade-in">
          Upload Quiz PDF
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 from-white via-red-100 to-red-200"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Week:
            </label>
            <input
              type="number"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter week number"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject:
            </label>
            <div className="flex flex-col space-y-2">
              <select
                value={isNewSubject ? "" : subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setIsNewSubject(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={isNewSubject}
              >
                <option value="">Select an existing subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newSubject"
                  checked={isNewSubject}
                  onChange={(e) => setIsNewSubject(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="newSubject" className="text-sm text-gray-700">
                  Create a new subject
                </label>
              </div>
              {isNewSubject && (
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter new subject name"
                  required
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              PDF File:
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-500 rounded-lg shadow-lg tracking-wide border border-purple-500 cursor-pointer hover:bg-purple-50 transition-all">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  {file ? file.name : "Select a PDF file"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Uploading...</span>
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </form>
        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
