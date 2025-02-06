"use client";

import { TiThMenu } from "react-icons/ti";
import { FaWindowClose } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import ProfileDropDown from "../components/ProfileDropdown";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  let [open, setOpen] = useState(false);
  const router = useRouter();
  const paths = [
    ["/", "Home"],
    ["/quiz", "Quiz"],
    ["/dashboard/uploadPdf", "Questions"],
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  let loggedIn = session?.user;

  return (
    <header className="w-full shadow-md bg-gradient-to-b to-white via-red-100 from-red-200">
      <nav
        className={`flex flex-wrap justify-between items-center w-[98%] mx-auto`}
      >
        <Link href="/" className="flex items-center w-[30%] h-[80%]">
          <img
            src="/assests/mainLogo.jpg"
            alt="logo"
            className="h-[45px] w-[45px] mr-4 rounded-full"
          />
          <p className="text-xl font-semibold">NPTEL Hub</p>
        </Link>

        <div className="hidden md:block w-[30%] mx-auto justify-center">
          <ul className="text-xl flex font-medium p-0 gap-10 flex-row mt-0 border-0 w-[90%] mx-auto justify-center">
            {paths.map((path, index) => (
              <li key={index}>
                <Link
                  href={path[0]}
                  className={`block py-2 mb-2 px-3 text-gray-800  hover:text-white hover:bg-red-400 hover:rounded-2xl  transition-all duration-[300ms] ease-in ${
                    router.pathname === path[0]
                      ? "bg-red-400   text-white rounded-2xl transition-all duration-[300ms] ease-in"
                      : ""
                  }`}
                >
                  {path[1]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex md:flex-row md:pb-0 md:items-center md:justify-center gap-3 transition-all duration-500 ease-in list-none w-[30%]">
          {loggedIn ? (
            <div className="w-full">
              <div className="flex flex-row gap-6 items-center w-full justify-end my-4">
                <ProfileDropDown />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-row gap-10 justify-end">
              <li>
                <Link href="/signup" className="btn-7 p-1 rounded-lg">
                  <span className="flex flex-row justify-center items-center gap-1 text-sm md:text-lg">
                    <p className="z-[100] flex flex-row justify-center items-center gap-1">
                      <SiGnuprivacyguard />
                      SignUp
                    </p>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="btn-7 p-1 rounded-lg mr-14">
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
            </div>
          )}

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
