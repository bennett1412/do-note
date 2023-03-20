import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common/layout.page.scss";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "../hooks/useAuthUser";
import Loader from "../components/Loader";

const Pagelayout = () => {
  const { user } = useAuthUser();

  return (
    <>
      {user.isLoading ? (
        <Loader magnify={2} />
      ) : (
        <>
          <Navbar />
          <main style={{ position: "relative" }}>
            <Outlet />
          </main>
          <Toaster />
        </>
      )}
    </>
  );
};

export default Pagelayout;
