import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import "../styles/common/navbar.scss";
import useStore from "./../hooks/useStore";
const Navbar = ({ pfp }) => {
  const syncing = useStore((state) => state.syncing);
  return (
    <nav>
      <a href="/">DoNote</a>
      {pfp && <img src={pfp} alt="profile-pic" />}
      {syncing ? "syncing" : "done  "}
    </nav>
  );
};

export default Navbar;
