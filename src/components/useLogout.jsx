import toast from "react-hot-toast";

const useLogout = () => {
  const Logout = () => {
    toast.success("Logged out");
  };

  return Logout;
};

export default useLogout;
