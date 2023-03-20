import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase/init";
import { useAuthUser } from "./../hooks/useAuthUser";

const ProtectedRoutes = () => {
  const { user } = useAuthUser();
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
