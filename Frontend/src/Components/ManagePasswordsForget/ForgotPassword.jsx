import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import FormField from "../Login/LoginFormField";
import { NavLink, useLocation } from "react-router-dom";
import Button from "../Button";

const ForgotPassword = ({ notify }) => {
  const location = useLocation();
  const [submitDone, setSubmitDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const endpoint = location.pathname.includes("teacher");

  const onSubmit = async (data) => {
    setIsLoading(true); // Start loading
    try {
      const endpoint = location.pathname.includes("teacher")
        ? "http://localhost:5000/api/teachers/forgot-password"
        : "http://localhost:5000/api/students/forgot-password";

      const response = await axios.post(endpoint, data, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("A password reset link has been sent to your email address.");
      setSubmitDone(true);
      notify("A password reset link has been sent to your email.", "success");
    } catch (error) {
      if (error.response) {
        const errorMsg =
          error.response?.data?.msg || "Failed to send reset link";
        setMessage(errorMsg);
        notify(errorMsg, "error");
      } else {
        notify("Error sending reset link. Please try again.", "error");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="main text-white h-screen w-full flex gap-4 justify-center items-center flex-col">
      <div className="mainForm h-fit w-[20rem] border-[2px] border-zinc-600 py-6 px-4 overflow-hidden rounded-md">
        <div className="top w-full h-20 flex justify-between items-center flex-col">
          <div className="logo border-[2px] text-white border-zinc-500 overflow-hidden h-12 w-12 rounded-full  flex justify-center items-center">
            <NavLink to="/" className="h-full w-full">
              <img
                src="/logo.svg"
                alt="img"
                className="h-full w-full object-cover object-top"
              />
            </NavLink>
          </div>
          <h1 className="text-2xl font-base">Forgot Password</h1>
        </div>
        {submitDone ? (
          <div className="after h-fit w-full mt-10 flex justify-between flex-col gap-4">
            <h1>
              Check your email for a link to reset your password. If it doesn’t
              appear within a few minutes, check your spam folder.
            </h1>
            <NavLink
              className="py-1 px-2 w-full text-center text-white text-base font-base border-[1px] border-zinc-600 rounded-md mx-auto bg-transparent hover:bg-zinc-900"
              to={endpoint ? "/teacher/login" : "/student/login"}
            >
              Return to sign in!
            </NavLink>
          </div>
        ) : (
          <div className="main-content h-fit w-full mt-10">
            <h1 className="text-base font-base leading-none mb-8">
              Enter your user account's verified email address and we will send
              you a password reset link.
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="h-full w-full"
            >
              <FormField
                label="Email Address"
                name="email"
                type="email"
                control={control}
                errors={errors.email?.message}
              />
              <Button isLoading={isLoading} name="Send Reset Link" />
            </form>
            {message && (
              <p className="mt-4 text-center bg-red-950 border-[1px] border-red-900 p-2 rounded-md text-sm ">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
