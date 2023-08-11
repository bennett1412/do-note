import React from "react";
import styles from "./styles/auth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../../utils/firebase/init";
import { toast } from "react-hot-toast";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { DotsLoader } from "@/components/Common/Loader";
import Button from "../Common/Button";
import Link from "next/link";

const Auth = () => {
  const handleGoogleSignup = () => {
    const toastId = toast.loading("Signing you in...");
    // * change to async await and disable button till action completes
    signInWithGoogle()
      .then((res) => {
        if (res.user) {
          toast.success("Done", {
            id: toastId,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Uh oh, something went wrong", {
          id: toastId,
        });
      });
  };
  return (
    <section className={styles.auth_section}>
      <Button className={styles.offline_button}>
        <Link href={"/notes/offline"}> Go Offline? </Link>
      </Button>
      <div className={styles.text}>
        <div className={styles.title}>Do Note</div>
        <p className={styles.subtext}>
          A lightweight note taking app for your hyper productive self.
        </p>
      </div>
      <Button className={styles.auth_button} onClick={handleGoogleSignup}>
        <FcGoogle size={20} />
        Continue with Google?
      </Button>
    </section>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: DotsLoader,
})(Auth);
