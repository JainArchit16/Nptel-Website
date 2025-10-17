import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiSave } from "react-icons/fi";
import { motion } from "framer-motion";
import React from "react";
const ProfileEditor = ({ session }) => {
  const [gender, setGender] = useState("");
  const [college, setCollege] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch initial profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setGender(data.gender || "");
          setCollege(data.college || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [session]);

  const handleSave = async () => {
    const id = toast.loading("Saving profile...");
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, gender, college }),
      });
      toast.dismiss(id);
      if (res.ok) {
        toast.success("Profile saved!");
        setIsEditing(false);
      } else {
        toast.error("Failed to save profile.");
      }
    } catch (error) {
      toast.dismiss(id);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <img
          className="h-16 w-16 rounded-full border-2 border-blue-500"
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name}`}
          alt="User avatar"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {session?.user?.name}
          </h2>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <input
            type="text"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setIsEditing(true);
            }}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., Male, Female"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College
          </label>
          <input
            type="text"
            value={college}
            onChange={(e) => {
              setCollege(e.target.value);
              setIsEditing(true);
            }}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., University of Technology"
          />
        </div>
      </div>

      {isEditing && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSave}
          className="mt-6 flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
        >
          <FiSave className="w-5 h-5" />
          <span>Save Changes</span>
        </motion.button>
      )}
    </div>
  );
};

export default ProfileEditor;
