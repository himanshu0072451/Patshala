import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import FormField from "../Login/LoginFormField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../Button";

const ResetPassword = ({ notify }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [submitDone, setSubmitDone] = useState(false);
  const isTeacherEndpoint = location.pathname.includes("teacher");
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters!")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        console.log("Checking! try");
        const endpoint = isTeacherEndpoint
          ? `/api/teachers/check-reset-token/${token}`
          : `/api/students/check-reset-token/${token}`;
        const response = await axios.get(endpoint);
        // console.log(response.data);
      } catch (err) {
        if (err.response?.status === 400 || err.response?.status === 401) {
          navigate(
            isTeacherEndpoint
              ? "/teacher/forgot-password"
              : "/students/forgot-password"
          );
        } else {
          notify("Unexpected error occurred. Please try again.", "error");
        }
      }
    };

    checkTokenValidity();
  }, [token, navigate, isTeacherEndpoint, notify]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const endpoint = isTeacherEndpoint
        ? `http://localhost:5000/api/teachers/reset-password/${token}`
        : `http://localhost:5000/api/students/reset-password/${token}`;

      const response = await axios.post(endpoint, {
        password: data.password,
        resetToken: token,
      });

      setMessage(response.data.msg);
      setSubmitDone(true);
      notify("Password has been successfully reset!", "success");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.msg || "Failed to reset password";
      setMessage(errorMsg);
      notify(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main text-white h-screen w-full flex gap-4 justify-center items-center flex-col">
      <div className="mainForm h-fit w-[20rem] border-[2px] border-zinc-600 py-6 px-4 overflow-hidden rounded-md">
        <div className="top w-full h-20 flex justify-between items-center flex-col">
          <div className="logo border-[2px] text-white border-zinc-500 overflow-hidden h-12 w-12 rounded-full flex justify-center items-center">
            <NavLink to="/" className="h-full w-full">
              <img
                src="/logo.svg"
                alt="img"
                className="h-full w-full object-cover object-top"
              />
            </NavLink>
          </div>
          <h1 className="text-2xl font-base">Reset Password</h1>
        </div>
        {submitDone ? (
          <div className="after h-fit w-full mt-10 flex justify-between flex-col gap-4">
            <h1>
              Password has been successfully reset. You can now log in with your
              new password.
            </h1>
            <NavLink
              to={
                isTeacherEndpoint ? "/teacher/login" : "/student/login"
              }
              className="py-1 px-2 w-full text-white text-base font-base border-[1px] border-zinc-600 rounded-md mx-auto bg-transparent hover:bg-zinc-900 text-center"
            >
              Return to sign in!
            </NavLink>
          </div>
        ) : (
          <div className="main-content h-fit w-full mt-10">
            <h1 className="text-base font-base leading-none mb-8">
              Enter your new password below.
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="h-full w-full"
            >
              <FormField
                label="New Password"
                name="password"
                type="password"
                control={control}
                errors={errors.password?.message}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                control={control}
                errors={errors.confirmPassword?.message}
              />
              <Button isLoading={isLoading} name="Reset password" />
            </form>
            {message && (
              <p className="w-fit mt-4 mx-auto text-center bg-red-950 border-[1px] border-red-900 py-2 px-4 rounded-full text-sm ">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
