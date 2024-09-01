import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const ButtonAnimation = ({
  index,
  hoverIndex,
  setHoverIndex,
  name,
  downloadPath,
  arrow,
  path,
  download,
  viewPath,
  notesBox,
}) => {
  const commonMotionDiv = (
    <motion.div
      key={index}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
      className={`BlockCon cursor-pointer relative h-14 ${notesBox && "h-8"} w-full flex items-center overflow-hidden`}
    >
      <div className="textAnime flex justify-between items-center w-full">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: hoverIndex === index ? "-150%" : "0" }}
          transition={{
            duration: 0.8,
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          className="txtWrap absolute left-0 w-full flex justify-between items-center"
        >
          <h1
            className={`text-2xl font-[400] ${
              notesBox && "text-xl font-[600]"
            }`}
          >
            {name}
          </h1>
          {arrow && <HiOutlineArrowNarrowRight className="text-2xl ml-2" />}
        </motion.div>
        <motion.div
          initial={{ y: "150%" }}
          animate={{ y: hoverIndex === index ? "0" : "150%" }}
          transition={{
            duration: 0.8,
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          className="txtWrap absolute left-0 w-full flex justify-between items-center"
        >
          <h1
            className={`text-2xl font-[400] ${
              notesBox && "text-xl font-[600]"
            }`}
          >
            {name}
          </h1>
          {arrow && <HiOutlineArrowNarrowRight className="text-2xl ml-2" />}
        </motion.div>
      </div>
      <div className="underlineWrap w-full h-fit mt-2 bottom-0 absolute">
        <div className="underline h-[1.1px] w-full bg-zinc-700 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: hoverIndex === index ? "100%" : "0" }}
            transition={{
              duration: 0.8,
              ease: [0.6, 0.05, -0.01, 0.9],
            }}
            className="underlineCover h-full bg-white"
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
  return download ? (
    <a
      href={downloadPath}
      download
      rel="noopener noreferrer"
      className="w-full"
    >
      {commonMotionDiv}
    </a>
  ) : (
    <NavLink to={name === "Access Notes" ? viewPath : path} className="w-full">
      {commonMotionDiv}
    </NavLink>
  );
};

export default ButtonAnimation;
