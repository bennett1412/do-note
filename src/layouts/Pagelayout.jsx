import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/Home/components/Navbar";
import "../styles/common/layout.page.scss";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "@react-query-firebase/auth";
import Loader from "../components/Loader";
import { auth } from "../utils/firebase/init";

const Pagelayout = () => {
  const user = useAuthUser(["user"], auth);

  if (user.isLoading) {
    return <Loader magnify={2} />;
  }

  return (
    <>
      <Navbar pfp={user.data.photoURL} />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};

export default Pagelayout;
