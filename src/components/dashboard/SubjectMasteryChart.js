import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubjectMasteryChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.subjectName),
    datasets: [
      {
        label: "Average Score",
        data: data.map((d) => d.averageScore),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Subject Mastery",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1F2937",
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
      {data.length > 0 ? (
        <div className="h-[350px]">
          <Bar options={options} data={chartData} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Complete quizzes to see your subject mastery.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectMasteryChart;
