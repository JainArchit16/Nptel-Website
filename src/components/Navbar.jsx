"use client";

import { TiThMenu } from "react-icons/ti";
import { FaWindowClose } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import ProfileDropDown from "../components/ProfileDropdown";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import image1 from "../../assests/mainLogo.jpeg";
const Navbar = () => {
  let [open, setOpen] = useState(false);
  const router = useRouter();
  const paths = [
    ["/home", "Home"],
    ["/gallery", "Gallery"],
    ["/about", "About Us"],
    ["/notice", "Notices"],
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  let loggedIn = false;

  return (
    <header className="w-full shadow-md">
      <nav
        className={`flex flex-wrap justify-between items-center w-[98%] py-1 mx-auto`}
      >
        <Link href="/" className="flex items-center w-[20%] h-[80%]">
          <img src={image1} alt="logo" className="h-[50px] w-[40px] mr-4" />
        </Link>

        <div className="hidden md:block w-[50%]">
          <ul className="text-xl flex font-medium p-0  space-x-8 flex-row mt-0 border-0 bg-white ">
            {paths.map((path, index) => (
              <li key={index}>
                <Link
                  href={path[0]}
                  className={`block py-2 mb-2 px-3 text-gray-800  hover:text-white hover:bg-red-600 hover:rounded-2xl  transition-all duration-[300ms] ease-in ${
                    router.pathname === path[0]
                      ? "bg-red-600   text-white rounded-2xl transition-all duration-[300ms] ease-in"
                      : ""
                  }`}
                >
                  {path[1]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex md:flex-row md:pb-0 md:w-auto md:items-center md:justify-center gap-3 transition-all duration-500 ease-in list-none">
          {loggedIn ? (
            <>
              <div className="flex flex-row gap-6 items-center">
                <ProfileDropDown />
              </div>
              {/* <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-white focus:outline-none"
                >
                  {menuOpen ? "Close" : "Menu"}
                </button>
              </div> */}
            </>
          ) : (
            <>
              {/* <li>
                <Link
                  to="/signup"
                  className=" text-xl duration-500 bg-red-600 p-2 rounded-2xl  text-gray-100 flex flex-row gap-2 justify-center items-center hover:scale-110 hover:text-gray-100"
                >
                  <SiGnuprivacyguard />
                  Sign Up
                </Link>
              </li> */}
              <li>
                <Link href="/signup" className="btn-7 p-2 rounded-lg">
                  <span className="flex flex-row justify-center items-center gap-1 text-sm md:text-lg">
                    <p className="z-[100] flex flex-row justify-center items-center gap-1">
                      <SiGnuprivacyguard />
                      SignUp
                    </p>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="btn-7 p-2 rounded-lg">
                  <span className="flex flex-row justify-center items-center gap-1 text-sm md:text-lg">
                    <p className="z-[100] flex flex-row justify-center items-center gap-1">
                      <IoMdLogIn />
                      Login
                    </p>
                  </span>
                </Link>
              </li>
              {/* <div>
                <a class="btn-7" href="#">
                  <span>Alternate</span>
                </a>
              </div> */}
            </>
          )}
          {/* (
            <li>
              <Link
                to="/dashboard"
                className="md:ml-8 text-xl  text-gray-800 hover:text-white duration-500 flex items-center"
              >
                <img
                  src={
                    user.photoURL
                      ? user.photoURL
                      : "https://api.dicebear.com/7.x/initials/svg?seed=${firstName}%20${lastName}"
                  }
                  alt="image"
                  className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover cursor-pointer"
                />
              </Link>
            </li>
          ) */}

          <div
            onClick={() => setOpen(!open)}
            className="text-3xl cursor-pointer md:hidden flex items-center"
          >
            {open ? <FaWindowClose /> : <TiThMenu className="text-black" />}
          </div>
        </div>
      </nav>
      <div
        className={`${open ? "block" : "hidden"} md:hidden w-full md:w-auto"`}
      >
        <ul className="text-xl flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-900  rtl:space-x-reverse ">
          {paths.map((path, index) => (
            <li key={index}>
              <Link
                href={path[0]}
                className={`block py-2 mb-2 px-3  hover:text-black  rounded hover:bg-gray-100 transition-all duration-[300ms] ease-in ${
                  router.pathname === path[0]
                    ? " bg-gray-100 text-black transition-all duration-[300ms] ease-in"
                    : "text-white"
                }`}
              >
                {path[1]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
