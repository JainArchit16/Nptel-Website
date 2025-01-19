/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useLocation } from "react-router-dom";
import image1 from "./assets/images/logo/logo.png";
import { UserContext } from "./models/UserContext";
import { TiThMenu } from "react-icons/ti";
import { FaWindowClose } from "react-icons/fa";
import { auth } from "./config/firebase";
import { IoMdLogIn } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import Typed from "typed.js";
import ProfileDropDown from "./components/DashBoard/ProfileDropdown";
import { useContext, useEffect, useState } from "react";
import { TeacherContext } from "./models/TeacherContext";

//darsh isko set krde ismein first name and last name wala part edit krna h
const Navbar = () => {
  const location = useLocation();
  if (location.pathname === "/") return null;
  const { loggedIn } = useContext(UserContext);
  const { loggedInTeacher } = useContext(TeacherContext);
  let [open, setOpen] = useState(false);
  const user = auth.currentUser;
  const paths = [
    ["/home", "Home"],
    ["/gallery", "Gallery"],
    ["/about", "About Us"],
    ["/notice", "Notices"],
  ];

  useEffect(() => {
    const typeData = new Typed(".role", {
      strings: [
        "Unity and Discipline",
        "Together we are Stronger",
        "Once a Cadet Always a Cadet",
      ],
      loop: true,
      typeSpeed: 100,
      backSpeed: 75,
      backDelay: 1500,
    });

    return () => {
      typeData.destroy();
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <header className="w-full shadow-md">
      <nav
        className={`flex flex-wrap justify-between items-center w-[98%] py-4 mx-auto`}
      >
        <Link to="/" className="flex items-center w-[20%] h-[80%]">
          <img src={image1} alt="ncc logo" className="h-[50px] w-[40px] mr-4" />
          <span className="role"></span>
        </Link>

        <div className="hidden md:block w-auto">
          <ul className="text-xl flex font-medium p-0  space-x-8 flex-row mt-0 border-0 bg-white ">
            {paths.map((path, index) => (
              <li key={index}>
                <Link
                  to={path[0]}
                  className={`block py-2 mb-2 px-3 text-gray-800  hover:text-white hover:bg-red-600 hover:rounded-2xl  transition-all duration-[300ms] ease-in ${
                    location.pathname === path[0]
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
          {loggedIn || loggedInTeacher ? (
            <>
              <div className="flex flex-row gap-6 items-center">
                <ProfileDropDown />
              </div>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup" className="btn-7 p-2 rounded-lg">
                  <span className="flex flex-row justify-center items-center gap-1 text-sm md:text-lg">
                    <p className="z-[100] flex flex-row justify-center items-center gap-1">
                      <SiGnuprivacyguard />
                      SignUp
                    </p>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="btn-7 p-2 rounded-lg">
                  <span className="flex flex-row justify-center items-center gap-1 text-sm md:text-lg">
                    <p className="z-[100] flex flex-row justify-center items-center gap-1">
                      <IoMdLogIn />
                      Login
                    </p>
                  </span>
                </Link>
              </li>
            </>
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
                to={path[0]}
                className={`block py-2 mb-2 px-3  hover:text-black  rounded hover:bg-gray-100 transition-all duration-[300ms] ease-in ${
                  location.pathname === path[0]
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
