import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const RefereshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.user.role;

        setIsAuthenticated(true);

        // Role-based redirection
        if (userRole === "student") {
          if (
            location.pathname.startsWith("/teacher") ||
            location.pathname === "/student/register" ||
            location.pathname === "/student/login"
          ) {
            navigate("/student/dashboard", { replace: true });
          } else if (location.pathname === "/upload-notes") {
            navigate("*", { replace: true });
          }
        } else if (userRole === "teacher") {
          if (
            location.pathname.startsWith("/student") ||
            location.pathname === "/teacher/register" ||
            location.pathname === "/teacher/login"
          ) {
            navigate("/teacher/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      }
    } else {
      // Handle case where there is no token
      setIsAuthenticated(false);

      const protectedRoutes = ["/notes", "/syllabus"];
      if (protectedRoutes.includes(location.pathname)) {
        navigate("/", { replace: true });
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

export default RefereshHandler;
