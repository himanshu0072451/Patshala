import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import FormField from "./LoginFormField";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import Cookies from "js-cookie";

const OtpVerification = ({ notify }) => {
  const navigate = useNavigate();
  const [resErrors, setResErrors] = useState({
    resendErr: "",
    submitErr: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const endpoint = location.pathname.includes("teacher");

  const validationSchema = yup.object().shape({
    otp: yup
      .string()
      .min(6, "OTP must be at least 6 characters!")
      .max(6, "OTP requires only 6 characters!")
      .required("OTP is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes
  const [btnClicked, setBtnClicked] = useState(false);

  useEffect(() => {
    if (btnClicked && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
    if (timeLeft === 0) {
      setBtnClicked(false); // Allow resend after countdown
    }
  }, [timeLeft, btnClicked]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const resetToken = Cookies.get(
        endpoint ? "teacherVerifyToken" : "studentVerifyToken"
      );
      if (!resetToken) {
        notify(
          "Authentication token is missing, please log in again.",
          "error"
        );
        return;
      }

      const apiEndpoint = endpoint
        ? "http://localhost:5000/api/teachers/resend-otp"
        : "http://localhost:5000/api/students/resend-otp";

      const res = await axios.post(
        apiEndpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );
      if (res) {
        setIsLoading(false);
      }
      setTimeLeft(120); // Reset to 5 minutes
      setBtnClicked(true);
      notify("OTP sent successfully", "success");
    } catch (error) {
      setIsLoading(false);
      if (
        error.response.status === 400 &&
        error.response.data.msg ===
          "An OTP has already been sent. Please wait for it to expire before requesting a new one."
      ) {
        setTimeLeft(60);
        setBtnClicked(true);
      }
      const errorMsg = error.response?.data?.msg || "Failed to resend OTP";
      setResErrors((prevErrors) => ({
        ...prevErrors,
        resendErr: errorMsg,
      }));
      notify(errorMsg, "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const verifyToken = Cookies.get(
        endpoint ? "teacherVerifyToken" : "studentVerifyToken"
      );
      // console.log("token", verifyToken);
      if (!verifyToken) {
        notify(
          "Authentication token is missing, please log in again.",
          "error"
        );
        return;
      }

      const apiEndpoint = endpoint
        ? "http://localhost:5000/api/teachers/verify-otp"
        : "http://localhost:5000/api/students/verify-otp";

      const response = await axios.post(apiEndpoint, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${verifyToken}`,
        },
        withCredentials: true,
      });

      if (response) {
        setIsLoading(false);
      }
      navigate(endpoint ? "/teacher/dashboard" : "/student/dashboard");
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.msg || "Error occurred";
      setResErrors((prevErrors) => ({
        ...prevErrors,
        submitErr: errorMsg,
      }));
      console.error(error.response.data.msg);
      notify(errorMsg, "error");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="main text-white h-screen w-full flex justify-center items-center flex-col">
      <div className="content-wrap h-fit w-[20rem] flex gap-4 justify-center items-center flex-col">
        <div className="mainForm h-fit w-full border-[2px] border-zinc-600 p-4 overflow-hidden rounded-md">
          <div className="top w-full h-20 flex justify-between items-center flex-col">
            <div className="logo border-[2px] text-white border-zinc-500 overflow-hidden h-12 w-12 rounded-full flex justify-center items-center">
              <NavLink to="/" className="h-full w-full">
                <img
                  src="/logo.svg"
                  alt="img"
                  className="h-full w-full text-white object-cover object-top"
                />
              </NavLink>
            </div>
            <h1 className="text-2xl font-base">User Verification</h1>
          </div>
          <div className="main-content h-full w-full mt-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="w-full"
              onKeyDown={handleKeyPress}
            >
              <FormField
                label="Enter code*"
                name="otp"
                type="number"
                control={control}
                errors={errors.otp?.message || resErrors.submitErr}
                time={formatTime(timeLeft)}
                onResend={handleResendOtp}
                btnClicked={btnClicked}
              />
              <Button type="submit" isLoading={isLoading} name="Verify OTP" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
