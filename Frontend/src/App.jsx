import React, { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/Home";
import StudentLogin from "./Components/Login/StudentLogin";
import StudentRegister from "./Components/Register/StudentRegister";
import TeacherLogin from "./Components/Login/TeacherLogin";
import TeacherRegister from "./Components/Register/TeacherRegister";
import TeacherDashboard from "./Components/Dashbord/TeacherDashbord";
import StudentDashboard from "./Components/Dashbord/StudentDashboard";
import RefereshHandler from "./Components/RefereshHandler";
import ForgotPassword from "./Components/ManagePasswordsForget/ForgotPassword";
import ResetPassword from "./Components/ManagePasswordsForget/ResetPassword";
import NotFound from "./Components/NotFound";
import OtpVerification from "./Components/Login/OtpVerification";
import LandingPage from "./Components/LandingPage/LandingPage";
import Notes from "./Components/Notes/Notes";
import NavBar from "./Components/NavBar/NavBar";
import SideBar from "./Components/SideBar/SideBar";
import UploadNotes from "./Components/Notes/UploadNotes/UploadNotes";
import Pyq from "./Components/Notes/Pyq";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to indicate loading state
  const loadingBarRef = useRef(null);
  const location = useLocation();
  const [menuClick, setMenuClick] = useState(false);

  useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const timer = setTimeout(() => {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const PrivateRoute = ({ element }) => {
    if (isAuthenticated === null) {
      return <div className="bg-zinc-950">Loading...</div>; // Show loading only when authentication status is undetermined
    }
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  const notify = (message, type = "success") => {
    type === "success" ? toast.success(message) : toast.error(message);
  };

  return (
    <div className="main min-h-screen w-full bg-zinc-950 text-white font-[Satoshi_Variable]">
      <LoadingBar color="rgb(30 64 175)" ref={loadingBarRef} />
      <ToastContainer position="top-right" autoClose={3000} />
      <RefereshHandler setIsAuthenticated={setIsAuthenticated} />
      {isAuthenticated === null ? (
        <div>Loading...</div> // Show a loading indicator or nothing while determining authentication status
      ) : (
        <>
          {isAuthenticated && (
            <>
              <NavBar setMenuClick={setMenuClick} />
              <SideBar
                notify={notify}
                menuClick={menuClick}
                setMenuClick={setMenuClick}
              />
            </>
          )}
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <LandingPage notify={notify} /> : <Home />
              }
            />
            <Route
              path="/student/login"
              element={<StudentLogin notify={notify} />}
            />
            <Route
              path="/student/register"
              element={<StudentRegister notify={notify} />}
            />
            <Route
              path="/teacher/login"
              element={<TeacherLogin notify={notify} />}
            />
            <Route
              path="/teacher/register"
              element={<TeacherRegister notify={notify} />}
            />
            <Route
              path="/teacher/forgot-password"
              element={<ForgotPassword notify={notify} />}
            />
            <Route
              path="/students/forgot-password"
              element={<ForgotPassword notify={notify} />}
            />
            <Route
              path="/teacher/reset-password/:token"
              element={<ResetPassword notify={notify} />}
            />
            <Route
              path="/student/reset-password/:token"
              element={<ResetPassword notify={notify} />}
            />
            <Route
              path="/teacher/dashboard"
              element={<PrivateRoute element={<TeacherDashboard />} />}
            />
            <Route
              path="/student/dashboard"
              element={<PrivateRoute element={<StudentDashboard />} />}
            />
            <Route
              path="/teacher/verify-otp"
              element={<OtpVerification notify={notify} />}
            />
            <Route
              path="/student/verify-otp"
              element={<OtpVerification notify={notify} />}
            />
            <Route path="/notes" element={<Notes notify={notify} />} />
            <Route path="/PYQ" element={<Pyq notify={notify} />} />
            <Route
              path="/upload-notes"
              element={
                <PrivateRoute element={<UploadNotes notify={notify} />} />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
