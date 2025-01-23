"use client";
import { useState } from 'react';
import QuizPage from './quizpage'; // Import the QuizPage component

export default function WeekSelector() {
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  return (
    <div style={{textAlign: "center", alignItems: "center"}}>
      <div style={{ display: 'flex', gap: '10px',alignItems: "center",justifyContent: "center",marginTop:'10px'}}>
        {[...Array(12).keys()].map((week) => (
          <button
            key={week + 1}
            onClick={() => handleWeekChange(week + 1)}
            style={{
              padding: '10px',
              backgroundColor: selectedWeek === week + 1 ? '#007bff' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Week {week + 1}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        {selectedWeek ? (
          <QuizPage params={{ week: selectedWeek }} />
        ) : (
          <p>Please select a week to view the quiz.</p>
        )}
      </div>
    </div>
  );
}
