import { FiActivity } from "react-icons/fi";

const RecentActivity = ({ quizzes }) => {
  // Get the last 3 quizzes
  const recentQuizzes = quizzes.slice(-3);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
      {recentQuizzes.length > 0 ? (
        <ul className="space-y-4">
          {recentQuizzes.map((quiz) => (
            <li key={quiz.quizId} className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
                <FiActivity size={20} />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-700">
                  Completed "{quiz.subject?.name || "N/A"}" quiz
                </p>
                <p className="text-sm text-gray-500">
                  Scored {quiz.score} with {quiz.accuracy}% accuracy
                </p>
              </div>
              <p className="text-sm text-gray-400 flex-shrink-0">
                {new Date(quiz.attemptTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No recent activity to show.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
