"use client";
import { useState, useEffect } from "react";

export default function QuizPage({ params }) {
  const { subjectId, week, id} = params;
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
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              color: "#007bff",
              marginBottom: "20px",
            }}
          >
            Quiz Results
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            Your score: {quizResults.score.toFixed(2)}%
          </p>
          {questions.map((question) => (
            <div
              key={question.questionId}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {question.questionText}
              </h3>
              <p style={{ fontSize: "16px", color: "#555" }}>
                Your answer: {answers[question.questionId] || "Not answered"}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color:
                    quizResults.correctAnswers[question.questionId] ===
                    answers[question.questionId]
                      ? "green"
                      : "red",
                }}
              >
                Correct answer:{" "}
                {quizResults.correctAnswers[question.questionId]}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {questions.map((question) => (
          <div
            key={question.questionId}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {question.questionText}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {question.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.questionId}`}
                    value={option}
                    onChange={() =>
                      handleOptionChange(question.questionId, option)
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#007bff",
                    }}
                  />
                  <span style={{ fontSize: "16px", color: "#555" }}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#007bff",
          fontWeight: "bold",
          fontSize: "32px",
        }}
      >
        Quiz for {`Subject ${subjectId}, Week ${week}`}
      </h1>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>
      ) : questions.length > 0 ? (
        renderQuizContent()
      ) : (
        <p style={{ textAlign: "center", color: "#555" }}>
          Loading questions...
        </p>
      )}
    </div>
  );
}
