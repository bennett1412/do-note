import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common/layout.page.scss";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "../hooks/useAuthUser";
import Loader from "../components/Loader";
import { auth } from "../utils/firebase/init";

const Pagelayout = () => {
  const user = useAuthUser();
  // const queryClient = useQueryClient();
  // add a case for auth error
  return (
    <>
      {user.isLoading ? (
        <Loader magnify={2} />
      ) : (
        <>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Toaster />
        </>
      )}
    </>
  );
};

export default Pagelayout;
