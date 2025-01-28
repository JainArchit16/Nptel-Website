"use client";
import { useState, useEffect } from "react";
import QuizPage from "./quizpage"; // Import the QuizPage component

export default function SubjectWeekSelector() {
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
    <div style={{ textAlign: "center", alignItems: "center" }}>
      <h1>Select Subject</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {subjects.map((subject) => (
          <button
            key={subject.subjectId}
            onClick={() => handleSubjectChange(subject.subjectId)}
            style={{
              padding: "10px",
              backgroundColor:
                selectedSubject === subject.subjectId ? "#007bff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {selectedSubject && (
        <>
          <h2 style={{ marginTop: "20px" }}>Select Week</h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {[...Array(12).keys()].map((week) => (
              <button
                key={week + 1}
                onClick={() => handleWeekChange(week + 1)}
                style={{
                  padding: "10px",
                  backgroundColor:
                    selectedWeek === week + 1 ? "#007bff" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Week {week + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        {selectedSubject && selectedWeek ? (
          <QuizPage params={{ subjectId: selectedSubject, week: selectedWeek }} />
        ) : (
          <p>
            {selectedSubject
              ? "Please select a week to view the quiz."
              : "Please select a subject to proceed."}
          </p>
        )}
      </div>
    </div>
  );
}
