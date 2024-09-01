// SharedLoginForm.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import FormField from "./LoginFormField";
import Button from "../Button";

const SharedLoginForm = ({
  onSubmit,
  control,
  errors,
  resErrors,
  isLoading,
  handleKeyPress,
  formType,
  student,
  teacher,
  buttonText,
  linkTo,
}) => {
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
            <h1 className="text-2xl font-base">Sign in to PatShala</h1>
          </div>
          <div className="main-content h-full w-full mt-10">
            <form
              onSubmit={onSubmit}
              method="post"
              onKeyDown={handleKeyPress}
              className="h-full w-full"
            >
              <FormField
                label="Email address"
                name="email"
                type="email"
                control={control}
                isLoading={isLoading}
                errors={errors.email?.message || resErrors.email}
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                student={student}
                teacher={teacher}
                control={control}
                isLoading={isLoading}
                errors={errors.password?.message || resErrors.password}
              />
              <Button
                isLoading={isLoading}
                disable={isLoading}
                name={buttonText}
              />
            </form>
          </div>
        </div>
        <div className="button-wrap h-fit w-full gap-1 p-3 border-[2px] rounded-md border-zinc-600 flex justify-between items-center">
          <h1 className="text-sm font-base">New to PatShala?</h1>
          <NavLink to={linkTo} className="text-cyan-600">
            Create an account
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SharedLoginForm;
