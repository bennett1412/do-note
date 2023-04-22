import React from "react";
import styles from "../../styles/auth/auth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../../utils/firebase/init";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const Auth = () => {
  const router = useRouter();
  const handleGoogleSignup = () => {
    const toastId = toast.loading("Signing you in...");
    // * change to async await and disable button till action completes
    signInWithGoogle()
      .then((res) => {
        if (res.user) {
          toast.success("Done", {
            id: toastId,
          });
          router.push("/");
        }
      })
      .catch((error) => {
        toast.error("Uh oh, something went wrong", {
          id: toastId,
        });
      });
  };
  return (
    <section className={styles.auth_section}>
      <div className={styles.text}>
        <div className={styles.title}>Do Note</div>
        <p className={styles.subtext}>
          A lightweight note taking app for your hyper productive self.
        </p>
      </div>
      <button onClick={handleGoogleSignup}>
        <FcGoogle size={20} />
        Continue with Google?
      </button>
    </section>
  );
};

export default Auth;
