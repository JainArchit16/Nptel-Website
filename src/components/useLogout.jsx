import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const useLogout = () => {
  const Logout = async () => {
    try {
      await signOut({ callbackUrl: "/" }); // Redirect to the homepage or any URL after logout
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return Logout;
};

export default useLogout;
