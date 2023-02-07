import React from "react";
import "../../styles/auth/auth.scss";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../../utils/firebase/init";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Auth = ({}) => {
  const navigate = useNavigate();
  const handleGoogleSignup = () => {
    const toastId = toast.loading("Signing you in...");
    signInWithGoogle()
      .then((res) => {
        if (res.user) {
          toast.success("Done", {
            id: toastId,
          });
          navigate("/");
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
    <section className="auth-section">
      <div className="text">
        <div>Do Note</div>
      </div>
      <button onClick={handleGoogleSignup}>
        <FcGoogle size={20} />
        Continue with Google?
      </button>
    </section>
  );
};

export default Auth;
