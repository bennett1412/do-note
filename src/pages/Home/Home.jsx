import React from "react";
import Navbar from "../../components/Navbar";
import Tagbar from "./components/Tagbar";
import NotesList from "./components/NotesList";

const Home = () => {
  return (
    <>
      <Tagbar />
      <NotesList />
    </>
  );
};

export default Home;
