"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "../../../components/Spinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;
  const profileGender = session?.user?.gender;
  const profileCollege = session?.user?.college;

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [gender, setGender] = useState(profileGender || "");
  const [college, setCollege] = useState(profileCollege || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async (userId) => {
      if (!userId) {
        return;
      }

      try {
        const res = await fetch(`/api/quiz/totalMarks/${userId}`);
        if (res.status === 200) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user quizzes when session is available
    if (session?.user?.id) {
      fetchQuizDetails(session.user.id);
    }
  }, [session]);

  const handleSave = async () => {
    const id = toast.loading("Saving");
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          gender,
          college,
        }),
      });
      toast.dismiss(id);
      if (res.status === 200) {
        toast.success("Saved");
        setIsEditing(false);
        // Optionally, you can update the session or refetch user data here
      }
    } catch (error) {
      toast.dismiss(id);
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <section className="bg-blue-50 w-full">
      <div className="mx-auto py-10 h-full w-[75%]">
        <div className="bg-white px-6 py-8 mb-4 shadow-xl rounded-lg border m-4 md:m-0">
          <h1 className="text-3xl font-bold my-4">Your Profile</h1>
          <div className="my-6">
            <img
              className="h-24 w-24 rounded-full mx-auto md:mx-0"
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                session?.user?.name
              }%20${``}`}
              width={150}
              height={150}
              alt="User"
            />
          </div>

          <div className="flex flex-row items-center w-full justify-between p-5">
            <div className="w-[40%]">
              <h2 className="text-xl mb-4">
                <span className="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 className="text-xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>
            <div className="w-[40%]">
              <div className="mb-4">
                <label className="font-bold block">Gender:</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setIsEditing(true);
                  }}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="font-bold block">College:</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => {
                    setCollege(e.target.value);
                    setIsEditing(true);
                  }}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto py-10 h-full w-[80%]">
        <div className="bg-white px-6 py-8 mb-4 shadow-xl rounded-lg border m-4 md:m-0">
          <h2 className="text-xl font-semibold mb-4">Your Quiz Results</h2>
          {loading ? (
            <Spinner loading={loading} />
          ) : quizzes.length === 0 ? (
            <p>You have not attempted any quizzes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken (s)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.quizId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.quizId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.subject?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.week}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.accuracy ? `${quiz.accuracy}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.timeTaken || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
