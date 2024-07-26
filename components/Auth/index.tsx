import React, { useEffect } from "react";
import styles from "./styles/auth.module.scss";
import { FcGoogle } from "react-icons/fc";

import { toast } from "react-hot-toast";
import { supabase } from "@/utils/supabase/init";
import { useRouter } from "next/router";
import { useSession } from "@/hooks/useSession";

const Auth = () => {
  const handleGoogleSignup = async () => {
    const toastId = toast.loading("Signing you in...");
    // * change to async await and disable button till action completes
    console.log('handlegooglesigin')
    signInWithGoogle()
  };
  const router = useRouter()
  const {signInWithGoogle} = useSession();
  

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
