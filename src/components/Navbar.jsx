"use client";

import { FiMenu, FiX } from "react-icons/fi";
import { RiLoginBoxLine, RiUserAddLine } from "react-icons/ri";
import ProfileDropDown from "../components/ProfileDropdown";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { path: "/", name: "Home" },
    { path: "/quiz", name: "Quiz" },
    { path: "/dashboard/uploadPdf", name: "Questions" },
    { path: "/mocktest", name: "Mock Test" },
    { path: "/bookmark", name: "Bookmarked Questions" },
  ];

  const loggedIn = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assests/mainLogo.jpg"
              alt="NPTEL Hub Logo"
              className="h-10 w-10 rounded-full border-2 border-gray-200"
            />
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              NPTEL Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`relative px-3 py-2 text-sm font-medium ${
                      router.pathname === item.path
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    } transition-colors`}
                  >
                    {item.name}
                    {router.pathname === item.path && (
                      <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-blue-500" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <ProfileDropDown />
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <RiLoginBoxLine className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <RiUserAddLine className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <ul className="pt-4 space-y-2 border-t border-gray-100">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block px-4 py-2 text-base font-medium ${
                      router.pathname === item.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    } rounded-lg`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {!loggedIn && (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      <RiLoginBoxLine className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="flex items-center space-x-2 px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <RiUserAddLine className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
