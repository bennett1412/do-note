import React, { useEffect } from "react";
import styles from "./styles/auth.module.scss";
import { FcGoogle } from "react-icons/fc";

import { toast } from "react-hot-toast";
import { supabase } from "@/utils/supabase/init";
import { useRouter } from "next/router";
import { useSession } from "@/hooks/useSession";

const Auth = () => {
  const { status, signInWithGoogle } = useSession();
  const handleGoogleSignup = async () => {
    const toastId = toast.loading("Signing you in...");
    signInWithGoogle();
  };
  useEffect(() => {
    console.log(status);
    if (status === "authenticated") {
      toast.success("Already loggedin, redirecting to home...", { id: "prev-loggedin" });
    }
  }, [status]);
  const authLoading = status === "loading" || status == "authenticated";
  return (
    <section className={styles.auth_section}>
      <div className={styles.text}>
        <div className={styles.title}>Do Note</div>
        <p className={styles.subtext}>
          A lightweight note taking app for your hyper productive self.
        </p>
      </div>

      <button disabled={authLoading} onClick={handleGoogleSignup}>
        {authLoading ? (
          <>Checking if you&apos;re logged in...</>
        ) : (
          <>
            <FcGoogle size={20} />
            Continue with Google?
          </>
        )}
      </button>
    </section>
  );
};

export default Auth;
