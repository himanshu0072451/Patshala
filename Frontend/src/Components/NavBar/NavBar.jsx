import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import useMediaQuery from "../../utils/useMediaQuery";
import { FaRegUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const NavBar = ({ setMenuClick }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const isMobile = useMediaQuery("(min-width: 768px)");

  const location = useLocation();
  const notes = location.pathname === "/notes";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  let userRole = "";
  try {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.user.role;
    }
  } catch (error) {
    console.error("Invalid token or unable to decode", error);
  }
  return isMobile ? (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        backgroundColor: visible
          ? "rgba(9, 9, 11, 0.5)"
          : "rgba(9, 9, 11, 0.9)",
      }}
      transition={{ ease: [0.61, 1, 0.88, 1], duration: 0.3 }}
      className="nav px-6 h-16 fixed top-0 left-0 z-[99]  w-full flex justify-between items-center border-b-[0.5px] border-zinc-600"
    >
      <div
        onClick={() => setMenuClick(true)}
        className="menu rounded-full cursor-pointer overflow-hidden border-[1.5px]  hover:bg-white"
      >
        <h1 className="text-sm font-medium px-4 py-1 hover:text-black">MENU</h1>
      </div>
      <div className="logo">
        <NavLink to="/">
          <div className="logo h-10 w-10 bg-[#0B1215] border-[1.5px] border-zinc-500 flex justify-center items-center rounded-full overflow-hidden">
            <img
              src="./logo.svg"
              alt="Logo"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </NavLink>
      </div>
      <NavLink
        to={
          userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard"
        }
      >
        <div className="profile rounded-full overflow-hidden border-[1.5px]  hover:bg-white">
          <h1 className="text-sm font-medium px-4 py-1 rounded-full hover:bg-white hover:text-black">
            PROFILE
          </h1>
        </div>
      </NavLink>
    </motion.div>
  ) : (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        backgroundColor: visible
          ? "rgba(9, 9, 11, 0.5)"
          : "rgba(9, 9, 11, 0.9)",
      }}
      transition={{ ease: [0.61, 1, 0.88, 1], duration: 0.3 }}
      className="nav px-4 h-16 fixed top-0 left-0 z-[99]  w-full flex justify-between items-center"
    >
      <div className="mnu-txtWrap flex items-center flex-wrap">
        <div
          onClick={() => setMenuClick(true)}
          className="menu rounded-full cursor-pointer overflow-hidden mr-4"
        >
          <h1 className="text-lg font-medium">
            <FiMenu />
          </h1>
        </div>
        <div className="txt">
          <h1 className="text-sm font-['Helvetica']">
            {notes && "Explore Your Study Materials"}
          </h1>
        </div>
      </div>
      <NavLink
        to={
          userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard"
        }
      >
        <div className="profile rounded-full overflow-hidden">
          <h1 className="text-lg font-medium">
            <FaRegUserCircle />
          </h1>
        </div>
      </NavLink>
    </motion.div>
  );
};

export default NavBar;
