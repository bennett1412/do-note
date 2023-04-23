import Home from "@/components/Home/Home";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import React from "react";

const HomePage = () => {
  const user = useAuthUser();
  console.log(user.id);
  if (user.id == null) {
    return <div>Loading...</div>;
  }
  return <Home user={user} />;
};

// export default HomePage;
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(HomePage);
