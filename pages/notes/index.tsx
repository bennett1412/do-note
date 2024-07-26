import { DotsLoader } from "@/components/Common/Loader";
import Home from "@/components/Home";
import {
  AuthAction,
  withUser,
} from "next-firebase-auth";
import React from "react";

const HomePage = () => {
  return <Home />;
};

// export default HomePage;
// export const getServerSideProps = withAuthUserTokenSSR()();

export default HomePage;
