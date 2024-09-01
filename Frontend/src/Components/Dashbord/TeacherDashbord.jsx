import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        // The token will be automatically included in the request if withCredentials is true
        const response = await axios.get(
          "http://localhost:5000/api/protected",
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        setError("Error fetching protected data");
        console.error("Error fetching protected data:", error);
        // Handle unauthorized access or token expiration
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove the cookie
    setTimeout(() => {
      navigate("/"); // Redirect to home page
    }, 1000);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pt-52">
      <h1>TeacherDashboard</h1>
      <button onClick={handleLogout}>LogOut!</button>
      {data && (
        <div>
          <NavLink to="/">Home</NavLink>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
