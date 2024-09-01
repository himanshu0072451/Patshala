import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import ButtonAnimation from "../AnimationButton/ButtonAnimation";
import { motion } from "framer-motion";
import useMediaQuery from "../../utils/useMediaQuery";

const LandingPage = ({ notify }) => {
  const [menuClick, setMenuClick] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const isMobile = useMediaQuery("(min-width: 768px)");

  // Animation!
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // Adjusted to make the stagger effect visible
      },
    },
  };

  const child = {
    hidden: { y: "200%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  return (
    <div className="main h-full w-full bg-zinc-950 px-6">
      <div className="main-wrap h-full w-full">
        <NavBar setMenuClick={setMenuClick} />
        <SideBar
          notify={notify}
          menuClick={menuClick}
          setMenuClick={setMenuClick}
        />
        <div className="mainContent min-h-screen lg:flex lg:flex-col lg:justify-end w-full pt-20 sm:pt-36 md:pt-60 xl:pt-[15rem] 2xl:pt-[24rem] pb-4 sm:pb-6 2xl:pb-6 xl:justify-center">
          <div className="txtWrap h-full w-full flex flex-col justify-between">
            <div className="headTxtWrap h-full w-full pt-14 sm:pt-0 sm:flex sm:justify-center sm:items-center sm:flex-col md:block xl:justify-between">
              {isMobile ? (
                <div className="headingTxt">
                  <motion.h1
                    className="text-8xl xl:text-[9rem] 2xl:text-[16rem] font-[400] tracking-tighter overflow-hidden"
                    variants={container} // Apply container variants
                    initial="hidden"
                    animate="visible"
                  >
                    {"Paathshaala".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        className="inline-block tracking-tight"
                        variants={child} // Apply child variants
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <h2 className="text-2xl 2xl:text-5xl font-[400] tracking-tight mt-0">
                    Stay Ahead with Expert Resources
                  </h2>
                </div>
              ) : (
                <div
                  style={{
                    transform: "rotate(90deg)",
                  }}
                  className="headingTxt h-full w-full sm:w-fit flex flex-col justify-center sm:justify-between items-center gap-2 sm:gap-0"
                >
                  {["Paathshaala", "Paathshaala", "Paathshaala"].map(
                    (val, index) => (
                      <motion.h1
                        key={index}
                        className="leading-normal sm:leading-normal text-4xl sm:text-5xl  font-[600] sm:font-[400] tracking-normal sm:tracking-tighter overflow-hidden flex items-center justify-center text-center"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                      >
                        {val
                          .toUpperCase()
                          .split("")
                          .map((char, charIndex) => (
                            <motion.span
                              key={charIndex}
                              className="inline-block tracking-tight"
                              variants={child}
                            >
                              {char}
                            </motion.span>
                          ))}
                      </motion.h1>
                    )
                  )}
                </div>
              )}

              <div className="Underline h-[1px] w-full bg-zinc-800 mt-14 mb-8 sm:mt-16 md:mt-5 xl:mt-4  sm:mb-10 md:mb-[5.5rem] xl:mb-[6.5rem] 2xl:mb-40 2xl:mt-12">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 1.5,
                    ease: [0.6, 0.05, -0.01, 0.9],
                  }}
                  className="Underline h-[1px] w-0 bg-zinc-200" //mt-8 mb-28
                ></motion.div>
              </div>
            </div>

            <div className="bottomTxt h-fit w-full flex flex-col sm:flex-row justify-between gap-2 sm:gap-0  sm:mt-0 mt-10 xl:items-center">
              <p className="text-base sm:text-base md:text-lg xl:text-[1.1rem] 2xl:text-4xl leading-none sm:leading-tight md:leading-none 2xl:leading-none font-[400] tracking-tight w-full sm:w-[44%] md:w-1/2 mx-auto sm:mx-0">
                Get easy access to notes, syllabus, and resources that help you
                succeed. Everything you need to excel is here!
              </p>
              <div className="btn w-[80%] sm:w-[35%] lg:w-[18rem]  xl:w-96 mx-auto sm:mx-0">
                <ButtonAnimation
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                  name="Explore Notes"
                  arrow="true"
                  path="/notes"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
