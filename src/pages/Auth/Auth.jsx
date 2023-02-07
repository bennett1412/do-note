import React from "react";
import "../../styles/auth/auth.scss";
import { FcGoogle } from "react-icons/fc";
const Auth = ({}) => {
  return (
    <section className="auth-section">
      <div className="text">
        <div>Do Note</div>
      </div>
      <button>
        <FcGoogle size={20} />
        Continue with Google?
      </button>
    </section>
  );
};

export default Auth;
