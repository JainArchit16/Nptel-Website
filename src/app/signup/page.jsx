"use client"; // Mark this component as a client component

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { SiGnuprivacyguard } from "react-icons/si";

import { MdOutlineMail } from "react-icons/md";
import { BiSolidHide, BiSolidShow, BiSolidUserDetail } from "react-icons/bi";
import { HiIdentification } from "react-icons/hi2";
import Link from "next/link";

import "./signup.css"; // Import the CSS module

// import image1 from "/assests/login/login.jpeg";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const [email, setEmail] = useState(false);
  const [pass, setPass] = useState(false);
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const [click, setClick] = useState(false);
  const [clickC, setClickC] = useState(false);
  // const [fname, setfName] = useState("");
  const [name, setName] = useState("");
  const [confPass, setConfPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // fname: "",
    name: "",
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("ds");
  };

  async function onSubmit(data) {
    const { email, password, name, confirmPassword } = data;
    const toastId = toast.loading("Loading");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", name);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    try {
      const response = await fetch(`/api/signup`, {
        method: "POST",
        body: formData,
      });
      console.log(response);
      const data = await response.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(`Signup failed ${email}: ${error.message}`);
      console.log(error.message);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 transition-all ease-in duration-500">
        <div className="w-[90%] md:w-4/5 lg:w-3/5 xl:w-2/3 flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="hidden md:flex md:w-1/2 relative">
            <img
              src="/assests/login/login.jpeg"
              className="w-full h-full object-cover opacity-70"
              alt="Signup"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center p-5">
              <h2 className="text-5xl font-bold text-[#00308F] text-center mb-2">
                Already have an Account?
              </h2>
              <div className="w-20 border-2 rounded-xl mb-5"></div>
              <p className="text-white text-xl mb-20 text-center">
                Start your journey with us in one click
              </p>
              <Link
                href="/login"
                className="border-white border-2 p-1 px-2 rounded-full text-white hover:text-gray-500"
              >
                Log In
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center p-5">
            <h2 className="text-3xl font-bold mt-5 text-[#00308F]">
              Sign Up To Continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">
              <div className="mb-4">
                <div
                  className="flex items-center border-b-2 relative mb-1"
                  onFocus={() => setEmail(true)}
                >
                  <label
                    htmlFor="email"
                    className={`absolute left-2 transition-all ${
                      email ? "top-[-10px] text-sm" : "top-1 text-xl"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="outline-none w-full text-black"
                    onChange={handleChange}
                    onBlurCapture={(e) => {
                      e.target.value.length > 0 ? "" : setEmail(false);
                    }}
                    {...register("email")}
                  />
                  <MdOutlineMail className="text-2xl" />
                </div>
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div className="mb-4">
                <div
                  className="flex items-center border-b-2 relative mb-1"
                  onFocus={() => setName(true)}
                >
                  <label
                    htmlFor="lname"
                    className={`absolute left-2 transition-all ${
                      name ? "top-[-10px] text-sm" : "top-1 text-xl"
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="lname"
                    className="outline-none w-full"
                    onChange={handleChange}
                    onBlurCapture={(e) => {
                      e.target.value.length > 0 ? "" : setName(false);
                    }}
                    {...register("name", { required: false })}
                  />
                  <HiIdentification className="text-2xl" />
                </div>
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-center border-b-2 relative mb-1">
                  <label
                    htmlFor="password"
                    className={`absolute left-2 transition-all ${
                      pass ? "top-[-10px] text-sm" : "top-1 text-xl"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type={`${show ? "text" : "password"}`}
                    id="password"
                    className="outline-none w-full"
                    onChange={handleChange}
                    onFocus={() => setPass(true)}
                    onBlurCapture={(e) => {
                      if (e.target.value.length === 0) {
                        setPass(false);
                        setClick(false);
                      }
                    }}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long.",
                      },
                    })}
                  />
                  {show ? (
                    <BiSolidShow
                      className="text-2xl cursor-pointer"
                      onClick={() => {
                        setShow(!show);
                        setClick(true);
                      }}
                    />
                  ) : (
                    <BiSolidHide
                      className="text-2xl cursor-pointer"
                      onClick={() => {
                        setShow(!show);
                        setClick(true);
                      }}
                    />
                  )}
                </div>
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="mb-3">
                <div
                  className="flex items-center border-b-2 relative mb-1"
                  onFocus={() => setConfPass(true)}
                >
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute left-2 transition-all ${
                      confPass ? "top-[-10px] text-sm" : "top-1 text-xl"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <input
                    type={`${showC ? "text" : "password"}`}
                    id="confirmPassword"
                    className="outline-none w-full"
                    onChange={handleChange}
                    onBlurCapture={(e) => {
                      e.target.value.length > 0 ? "" : setConfPass(false);
                    }}
                    {...register("confirmPassword", {
                      required: "Confirm password is required.",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match.",
                    })}
                  />
                  {showC ? (
                    <BiSolidShow
                      className="text-2xl cursor-pointer"
                      onClick={() => {
                        setShowC(!showC);
                        setClickC(true);
                      }}
                    />
                  ) : (
                    <BiSolidHide
                      className="text-2xl cursor-pointer"
                      onClick={() => {
                        setShowC(!showC);
                        setClickC(true);
                      }}
                    />
                  )}
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <button
                className="flex items-center justify-center gap-2 text-xl w-full bg-[#00308F] rounded-2xl hover:text-gray-600 duration-500 transition mb-4 text-white font-semibold mt-3"
                type="submit"
              >
                <SiGnuprivacyguard />
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
