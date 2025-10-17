import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) =>
      new Date(item.attemptTime).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Quiz Score",
        data: data.map((item) => item.score),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3, // Makes the line curved
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
        text: "Performance Over Time",
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
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {data.length > 1 ? (
        <div className="h-[300px]">
          <Line options={options} data={chartData} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <p>Attempt at least two quizzes to see your performance trend.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
