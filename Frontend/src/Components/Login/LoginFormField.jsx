import React from "react";
import { Controller } from "react-hook-form";
import { NavLink } from "react-router-dom";

const FormField = ({
  label,
  name,
  time,
  type = "text",
  control,
  errors,
  onResend,
  student,
  teacher,
  btnClicked,
  upload,
  placeholder,
  isLoading,
}) => {
  const handleResendClick = (event) => {
    event.preventDefault();
    if (onResend) {
      onResend();
    }
  };

  return (
    <div className="mt-4 h-fit w-full">
      <div className="wrap-forget w-full flex justify-between items-center">
        <div
          className={`label-wrap ${
            name === "otp" ? "w-full" : "w-fit"
          } flex justify-between items-center`}
        >
          <h1 className="text-base w-fit font-base text-white">{label}</h1>
          {name === "otp" ? (
            <>
              {btnClicked ? (
                <button
                  onClick={() => {}}
                  className="text-sm font-base text-red-800 cursor-text"
                >
                  Time remaining: {time}
                </button>
              ) : (
                <button
                  onClick={handleResendClick}
                  className="text-base font-medium text-cyan-600 hover:text-cyan-800"
                >
                  Resend OTP!
                </button>
              )}
            </>
          ) : null}
        </div>
        {type === "password" && student ? (
          <NavLink
            to="/students/forgot-password"
            className="text-sm font-base text-cyan-600"
          >
            Forgot password?
          </NavLink>
        ) : (
          teacher && (
            <NavLink
              to="/teacher/forgot-password"
              className="text-sm font-base text-cyan-600"
            >
              Forgot password?
            </NavLink>
          )
        )}
      </div>
      <div
        className={
          upload ? "" : "mail-block w-full flex gap-2 items-center h-8"
        }
      >
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              type={type}
              {...field}
              disabled={isLoading}
              placeholder={placeholder}
              className={
                upload
                  ? "w-full px-2 py-1 font-[Satoshi] mt-2 text-base sm:text-lg bg-transparent rounded-lg font-medium border-[1px] border-zinc-700 outline-none active:bg-zinc-950"
                  : "w-full px-2 font-[Mona] text-base bg-transparent rounded-md font-medium border-[2px] border-zinc-500 outline-none active:bg-zinc-950"
              }
              value={field.value || ""}
            />
          )}
        />
      </div>
      {errors && <p className="text-red-500">{errors}</p>}
    </div>
  );
};

export default FormField;
