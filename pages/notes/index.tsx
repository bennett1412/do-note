import { DotsLoader } from "@/components/Common/Loader";
import Home from "@/components/Home/Home";
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import React from "react";

const HomePage = () => {
  return <Home />;
};

// export default HomePage;
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: () => <DotsLoader />,
})(HomePage);
