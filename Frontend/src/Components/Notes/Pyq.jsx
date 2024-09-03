import React from "react";
import ContentSection from "./ContentSection";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { BsDatabaseDown } from "react-icons/bs";
import { MdOutlineAccountTree } from "react-icons/md";
import { VscFileCode } from "react-icons/vsc";
import { LiaDigitalTachographSolid } from "react-icons/lia";
import { GrCloudComputer } from "react-icons/gr";

const Pyq = () => {
  const subjects = [
    { name: "All", icon: <HiMiniCubeTransparent /> },
    {
      name: "DBMS",
      icon: <BsDatabaseDown />,
      imgPath: "./NotesSub/DBMS.jpeg",
    },
    {
      name: "DSU",
      icon: <MdOutlineAccountTree />,
      imgPath: "./NotesSub/DSU.png",
    },
    {
      name: "OOP",
      icon: <VscFileCode />,
      imgPath: "./NotesSub/OOP.png",
    },
    {
      name: "DTE",
      icon: <LiaDigitalTachographSolid />,
      imgPath: "./NotesSub/DTE.png",
    },
  ];

  return (
    <ContentSection
      title="Prep Like a Pro: PYQs at Your Fingertips"
      type="pyq"
      subjects={subjects}
    />
  );
};

export default Pyq;
