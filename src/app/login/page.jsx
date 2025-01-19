"use client"; // Mark this component as a client component

import { useRouter } from "next/navigation";
import { useState } from "react";
// import styles from "./login.module.css"; // Import the CSS module
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { IoMdLogIn } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const [email, setEmail] = useState(false);
  const [pass, setPass] = useState(false);
  const [show, setShow] = useState(false);
  const [click, setClick] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(event) {
    event.preventDefault();

    const toastId = toast.loading("Loading");
    try {
      const { email, password } = data;
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token); // Store JWT token
        router.push("/");
      } else {
        const result = await response.json();
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-slate-100">
      <div className="w-[80%] md:h-[70%]  flex flex-col md:flex-row md:items-stretch items-center bg-white rounded-2xl shadow-2xl">
        <div className="md:w-[50%] w-full rounded-2xl flex flex-col items-center ">
          <h1 className="text-4xl font-bold mt-10 text-red-600">
            Sign In To Continue
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-[80%] mt-10">
            <div
              className="flex items-center justify-center border-b-2 relative w-full mt-20"
              onFocus={() => setEmail(true)}
            >
              <label
                htmlFor="email"
                className={`absolute left-1  ${
                  email
                    ? "transition-all top-[-15px] text-sm"
                    : "  top-0 text-xl transition-all ease-in"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="outline-none w-full"
                onBlurCapture={(e) => {
                  e.target.value.length > 0 ? "" : setEmail(false);
                }}
                {...register("email", { required: "Email is required." })}
              />
              <MdOutlineMail className="text-2xl" />
            </div>

            <br />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
            <div className="flex items-center justify-center border-b-2 relative mt-5">
              <label
                htmlFor="password"
                className={`absolute left-1  ${
                  pass
                    ? "transition-all top-[-15px] text-sm"
                    : "  top-0 text-xl transition-all ease-in"
                }`}
              >
                Password
              </label>
              {click ? (
                <input
                  type={`${show ? "text" : "password"}`}
                  id="password"
                  className="outline-none w-full"
                  onFocus={() => setPass(true)}
                  onBlurCapture={(e) => {
                    if (e.target.value.length === 0) {
                      setPass(false);
                      setClick(false);
                    }
                  }}
                  {...register("password", {
                    required: "Password is required.",
                  })}
                />
              ) : (
                <input
                  type={`${show ? "text" : "password"}`}
                  id="password"
                  className="outline-none w-full"
                  onFocus={() => setPass(true)}
                  onBlurCapture={(e) => {
                    e.target.value.length > 0 ? "" : setPass(false);
                  }}
                  {...register("password", {
                    required: "Password is required.",
                  })}
                />
              )}

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
            <br />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}

            <br />

            <div className="flex justify-end">
              <Link href="/forgotpass">
                <p className=" text-black hover:text-gray-600 text-xl">
                  Forgot Password?
                </p>
              </Link>
            </div>

            <button
              className="flex items-center justify-center gap-2 text-2xl w-full bg-red-600 rounded-2xl hover:text-gray-600 duration-500 transition text-white font-semibold mt-4 md:mb-0 mb-4 py-2"
              type="submit"
            >
              <IoMdLogIn />
              Login
            </button>
          </form>
        </div>
        <div className="md:mt-0 mt-4 md:w-[50%] w-full md:rounded-tr-2xl rounded-br-2xl py-36 px-12 hidden md:flex flex-col items-center justify-center relative md:ml-6">
          <div className="absolute w-full h-full md:rounded-tr-2xl rounded-br-2xl">
            <img
              src="/assests/login/login.jpeg"
              className="w-full h-full md:rounded-tr-2xl rounded-br-2xl md:rounded-bl-none rounded-bl-2xl"
            />
          </div>
          <div className="absolute flex flex-col justify-center items-center bg-black w-[100%] h-[100%] bg-opacity-35 rounded-tr-2xl rounded-br-2xl md:rounded-bl-none rounded-bl-2xl">
            <h2 className="text-5xl font-bold text-red-600 text-center mb-2">
              Don't have an account?
            </h2>
            <div className="w-20 border-2 rounded-xl mb-5"></div>
            <p className=" text-xl md:mb-20 mb-10 text-white text-center">
              Start your journey with NCC in one click
            </p>
            <Link
              href="/signup"
              className="border-white border-2 p-1 px-2 rounded-full text-white hover:text-gray-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
