import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotesBox from "./NotesBox/NotesBox";
import useMediaQuery from "../../utils/useMediaQuery";
import useUnderlinePosition from "../../utils/Notes-PYQ/useUnderlinePosition";

import axios from "axios";

const ContentSection = ({ title, type, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const isMobile = useMediaQuery("(min-width: 768px)");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/content?type=${type}`
        );
        setData(response.data.content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllNotes();
  }, [type]);

  const { underlineProps, navWrapRef } = useUnderlinePosition(
    selectedSubject,
    subjects,
    loading
  );

  const filteredNotes =
    selectedSubject === "All"
      ? data
      : data.filter((note) => note.subject === selectedSubject);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main min-h-full w-full px-4 sm:px-6 pb-10">
      <div className="content h-full">
        <div className="top pb-4 sm:pb-16">
          {isMobile ? (
            <>
              <div className="headTxt pt-32 text-center w-full overflow-hidden">
                <h1 className="text-xl sm:text-4xl w-full font-bold font-[Satoshi] flex flex-col">
                  {title}
                </h1>
              </div>
              <div className="nav-notes mt-14 px-6 lg:px-52 h-16 w-full">
                <div
                  ref={navWrapRef}
                  className="nav-wrap w-full h-full flex items-center justify-center gap-4 relative border-b-[1px] border-zinc-700 overflow-x-auto whitespace-nowrap scrollbar-hide overflow-y-hidden"
                >
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={index}
                      data-subject={subject.name}
                      onClick={() => setSelectedSubject(subject.name)}
                      initial={{ color: "rgb(255, 255, 255)" }}
                      animate={{
                        color:
                          selectedSubject === subject.name
                            ? "rgb(255, 255, 255)"
                            : "#71717a",
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.6, 0.05, 0.1, 0.9],
                      }}
                      className="elem cursor-pointer pl-1 pr-2 py-1 flex flex-col justify-between items-center gap-0 w-64"
                    >
                      <div className="icon h-9 w-9 text-xl overflow-hidden">
                        <span className="h-full w-full font-[900] object-center object-cover flex justify-center items-center">
                          {subject.icon}
                        </span>
                      </div>
                      <h1 className="font-semibold">{subject.name}</h1>
                    </motion.div>
                  ))}

                  <motion.div
                    className="underline absolute bottom-0 h-[2px] bg-gray-300"
                    initial={{
                      width: underlineProps.width,
                      left: underlineProps.x,
                    }}
                    animate={{
                      width: underlineProps.width,
                      left: underlineProps.x,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="nav-notes-mobile pt-20 h-fit w-full flex justify-center items-center flex-wrap gap-2">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setSelectedSubject(subject.name)}
                    animate={{
                      color:
                        selectedSubject === subject.name
                          ? "rgb(255, 255, 255)"
                          : "#71717a",
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.6, 0.05, 0.1, 0.9],
                    }}
                    className="elem w-fit bg-zinc-900 px-3 py-[0.35rem] rounded-full overflow-hidden flex justify-center items-center gap-1"
                  >
                    {subject.name === "All" && <span>{subject.icon}</span>}

                    <h1 className="text-base font-normal  font-[Satoshi] leading-none">
                      {subject.name}
                    </h1>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="heroSection h-full w-full">
          <div className="heroWrap h-full w-full flex gap-4 flex-wrap justify-center">
            {filteredNotes.map((note, index) => {
              const subject = subjects.find(
                (subject) => subject.name === note.subject
              );
              return (
                <NotesBox
                  key={index}
                  name={note.subject}
                  imgPath={subject?.imgPath}
                  title={note.title}
                  fileUrl={note.downloadURL}
                  viewUrl={note.viewURL}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
