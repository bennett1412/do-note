import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import "../styles/common/navbar.scss";
import useStore from "./../hooks/useStore";
import { ColorRing } from "react-loader-spinner";
import { BsCloudCheck } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useAuthUser } from "@react-query-firebase/auth";
const Navbar = ({ pfp }) => {
  const user = useAuthUser(["user"], auth);

  const syncing = useStore((state) => state.syncing);
  const ringColor = "#939393c7";
  return (
    <nav>
      <a href="/">DoNote</a>
      {user.data && <img src={user.data.photoURL} alt="profile-pic" />}
      {syncing ? (
        <ColorRing
          visible={true}
          height="40"
          width="40"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={[ringColor, ringColor, ringColor, ringColor, ringColor]}
        />
      ) : (
        <BsCloudCheck />
      )}
      <FiLogOut />
    </nav>
  );
};

export default Navbar;
