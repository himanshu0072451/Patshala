// StudentLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import SharedLoginForm from "./SharedLoginForm";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const StudentLogin = () => {
  const navigate = useNavigate();
  const [resErrors, setResErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/students/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.msg === "Login successful") {
        return navigate("/student/dashboard");
      }
      if (response.data.msg === "OTP sent to your email") {
        reset();
        return navigate("/student/verify-otp");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const { email, password } = error.response.data;
        setResErrors({
          email: email || "",
          password: password || "",
        });
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <SharedLoginForm
      onSubmit={handleSubmit(onSubmit)}
      control={control}
      errors={errors}
      resErrors={resErrors}
      isLoading={isLoading}
      student="student"
      handleKeyPress={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSubmit(onSubmit)();
        }
      }}
      buttonText="Sign In"
      linkTo="/student/register"
    />
  );
};

export default StudentLogin;
