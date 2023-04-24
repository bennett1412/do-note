import Home from "@/components/Home/Home";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import React from "react";

const HomePage = () => {
  const user = useAuthUser();

  if (user.id == null) {
    return <div style={{ color: "black" }}>Loading...</div>;
  }
  return <Home />;
};

// export default HomePage;
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(HomePage);
