import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [isTeacher, setIsTeacher] = useState(true);

  return (
    <div className="main h-full w-full py-16 px-8 md:px-16 lg:px-36 font-[Mona] text-white">
      <div className="wrap h-full w-full rounded-md flex overflow-hidden bg-zinc-900 px-4 shadow-lg shadow-zinc-900">
        <div className="left py-8 h-full w-full md:w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold mb-5">Welcome</h1>
          <div className="content h-2/3 w-full">
            <div className="top w-full py-1 flex justify-center items-center gap-1">
              <button
                className={`text-lg font-semibold px-2 py-1 w-1/2 border-b-[2px] border-zinc-300 ${
                  isTeacher ? "border-opacity-[1]" : "border-opacity-[.5]"
                } transition-all duration-75`}
                onClick={() => setIsTeacher(true)}
                aria-label="Select Teacher"
              >
                Teacher
              </button>
              <button
                className={`text-lg font-semibold px-2 py-1 w-1/2 border-b-[2px] border-zinc-300 ${
                  isTeacher ? "border-opacity-[.5]" : "border-opacity-[1]"
                } transition-all duration-75`}
                onClick={() => setIsTeacher(false)}
                aria-label="Select Student"
              >
                Student
              </button>
            </div>
            <div className="mid h-full w-full py-12 flex justify-start items-center gap-4">
              <div className="auth w-full md:w-1/2 flex justify-center items-center flex-col">
                {isTeacher ? (
                  <div className="teacher flex h-full w-full flex-col gap-2">
                    <div className="register-teacher flex justify-start items-center gap-3 w-full">
                      <h1 className="text-2xl font-semibold w-[45%]">
                        Register:
                      </h1>
                      <NavLink
                        to="/teacher/register"
                        className="text-base font-semibold py-1 px-3 border-[2px] border-zinc-300 rounded-md"
                        aria-label="Teacher Registration"
                      >
                        Click Me!
                      </NavLink>
                    </div>
                    <div className="login-teacher flex justify-start items-center gap-3 w-full">
                      <h1 className="text-2xl font-semibold w-[45%]">Login:</h1>
                      <NavLink
                        to="/teacher/login"
                        className="text-base font-semibold py-1 px-3 border-[2px] border-zinc-300 rounded-md"
                        aria-label="Teacher Login"
                      >
                        Click Me!
                      </NavLink>
                    </div>
                  </div>
                ) : (
                  <div className="student flex h-full w-full flex-col gap-2">
                    <div className="register-student flex justify-start items-center gap-3 w-full">
                      <h1 className="text-2xl font-semibold w-[45%]">
                        Register:
                      </h1>
                      <NavLink
                        to="/student/register"
                        className="text-base font-semibold py-1 px-3 border-[2px] border-zinc-300 rounded-md"
                        aria-label="Student Registration"
                      >
                        Click Me!
                      </NavLink>
                    </div>
                    <div className="login-student flex justify-start items-center gap-3 w-full">
                      <h1 className="text-2xl font-semibold w-[45%]">Login:</h1>
                      <NavLink
                        to="/student/login"
                        className="text-base font-semibold py-1 px-3 border-[2px] border-zinc-300 rounded-md"
                        aria-label="Student Login"
                      >
                        Click Me!
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
              <div className="img w-full md:w-1/2 h-full">
                <img
                  src={isTeacher ? "/teacher.svg" : "/student.svg"}
                  alt={isTeacher ? "Teacher Image" : "Student Image"}
                  className="h-full w-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="right h-full w-full md:w-1/2 flex justify-center items-center">
          <img
            className="w-[70%] object-cover object-center"
            src="/login.png"
            alt="Login Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
