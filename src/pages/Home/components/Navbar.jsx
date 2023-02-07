import React, { useEffect, useState } from "react";
import { auth } from "../../../utils/firebase/init";
import "../../../styles/common/navbar.scss";
const Navbar = ({ pfp }) => {
  return (
    <nav>
      <a href="/">DoNote</a>
      <img src={pfp} alt="profile-pic" />
    </nav>
  );
};

export default Navbar;
