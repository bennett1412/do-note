import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthUser } from "@react-query-firebase/auth";
import { auth } from "../utils/firebase/init";

const ProtectedRoutes = () => {
  const user = useAuthUser(["user"], auth);
  console.log(user);
  const navigate = useNavigate();
  if (user.data == null) {
    return <Navigate to={"/auth"} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
