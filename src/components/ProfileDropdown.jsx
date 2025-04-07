"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookMarked, LogOut, User } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import useLogout from "./useLogout";

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const Logout = useLogout();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showConfirmModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirmModal]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex h-10 w-10 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
            alt={userName}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target;
              target.style.display = "none";
            }}
          />
          <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
            {initials}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/bookmark"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              Bookmarked Questions
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                setShowConfirmModal(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default ProfileDropdown;
