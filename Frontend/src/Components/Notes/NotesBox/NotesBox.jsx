import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import useMediaQuery from "../../../utils/useMediaQuery";

const NotesBox = ({ name, imgPath, title, fileUrl, viewUrl, isMobile }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const isSmMobile = useMediaQuery("(min-width: 425px)");
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`main ${
        isSmMobile && "h-fit w-[11rem]"
      } sm:h-fit sm:w-[10rem] md:h-fit md:w-[13rem] lg:h-[20rem] lg:w-[22rem] font-[Satoshi] rounded-md relative`}
    >
      <div className="main-wrap h-full w-full flex flex-col justify-center items-center gap-2">
        <div className="left w-full h-[75%] lg:h-[82%] rounded-md overflow-hidden">
          <img
            src={imgPath}
            alt={`${name}-img`}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="right w-full h-[25%] lg:h-[12%] flex justify-start lg:justify-between items-start lg:items-center flex-col lg:flex-row gap-2 lg:gap-0">
          <h1 className="font-[Satoshi] lg:w-1/2 lg:bg-transparent text-xl leading-none tracking-tighter font-light text-wrap text-white">
            {title}
          </h1>
          {isMobile ? (
            <div className="btns relative overflow-hidden w-full lg:w-1/2 flex justify-start lg:justify-end items-center gap-2 lg:z-auto">
              {/* View Button */}
              <NavLink
                onMouseEnter={() => setHoverIndex(0)}
                onMouseLeave={() => setHoverIndex(null)}
                to={viewUrl}
                className="relative h-7 w-[4rem] flex justify-center items-center"
              >
                <div className="text-sm font-[400] h-7 w-[4rem] flex justify-center items-center relative px-4 py-1 rounded-full border-[1px] border-zinc-100 text-white">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoverIndex === 0 ? "-150%" : "0" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.6, 0.05, -0.01, 0.9],
                    }}
                    className="txtWrap h-full w-full absolute flex justify-center items-center"
                  >
                    <h1>View</h1>
                  </motion.div>
                  <motion.div
                    initial={{ y: "150%" }}
                    animate={{ y: hoverIndex === 0 ? "0" : "150%" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.6, 0.05, -0.01, 0.9],
                    }}
                    className="txtWrap h-full w-full absolute flex justify-center items-center"
                  >
                    <h1>View</h1>
                  </motion.div>
                </div>
              </NavLink>

              {/* Download Button */}
              <a
                href={fileUrl}
                download
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIndex(1)}
                onMouseLeave={() => setHoverIndex(null)}
                className="relative h-7 w-[6rem] flex justify-center items-center"
              >
                <button className="text-sm font-[400] h-7 w-[6rem] flex justify-center items-center relative px-4 py-1 rounded-full border-[1px] border-zinc-100 text-white">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoverIndex === 1 ? "-150%" : "0" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.6, 0.05, -0.01, 0.9],
                    }}
                    className="txtWrap h-full w-full absolute flex justify-center items-center"
                  >
                    <h1>Download</h1>
                  </motion.div>
                  <motion.div
                    initial={{ y: "150%" }}
                    animate={{ y: hoverIndex === 1 ? "0" : "150%" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.6, 0.05, -0.01, 0.9],
                    }}
                    className="txtWrap h-full w-full absolute flex justify-center items-center"
                  >
                    <h1>Download</h1>
                  </motion.div>
                </button>
              </a>
            </div>
          ) : (
            <div className="mob-btns relative overflow-hidden w-full md:w-1/2 flex justify-start md:justify-end items-center gap-2">
              <NavLink
                to={viewUrl}
                target="_blank"
                className="text-sm font-[400] h-7 w-[4rem] flex justify-center items-center px-2 py-1 rounded-full border-[1px] border-zinc-100 text-white"
              >
                View
              </NavLink>

              <a
                href={fileUrl}
                download
                rel="noopener noreferrer"
                className="relative h-7 w-[6rem] flex justify-center items-center"
              >
                <button className="text-sm font-[400] h-7 w-[6rem] flex justify-center items-center px-4 py-1 rounded-full border-[1px] border-zinc-100 text-white">
                  Download
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotesBox;
