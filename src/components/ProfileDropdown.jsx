"use client";

import { useEffect } from "react";
import { useRef, useState } from "react";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "./ConfirmationModal";

import useLogout from "./useLogout";
import Link from "next/link";

const ProfileDropDown = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const Logout = useLogout();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the dropdown when a click is detected outside of it
  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest(".profile-dropdown")) {
      setIsOpen(false);
    }
  };

  // Effect to add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]); // Re-run the effect when isOpen changes

  const ref = useRef(null);

  const handleLogout = () => {
    setIsOpen(false);
  };

  return (
    <button className="relative profile-dropdown">
      <img
        src={`https://api.dicebear.com/7.x/initials/svg?seed=${"sally"}%20${"grenaud"}`}
        alt="xyz"
        className="aspect-square w-[40px] rounded-full object-cover"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000]  divide-blue-600 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-white"
          ref={ref}
        >
          <Link href="/dashboard/UserProfile" onClick={() => setIsOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-black hover:bg-gray-300 ">
              <VscDashboard className="text-xl" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: Logout,
                btn2Handler: () => setConfirmationModal(null),
              });
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-black hover:bg-gray-300 "
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </button>
  );
};

export default ProfileDropDown;
