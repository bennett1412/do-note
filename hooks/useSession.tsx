import React, { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import { logout } from "../utils/firebase/init";
import { supabase } from "@/utils/supabase/init";
import { AuthError, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

type SessionType = {
  session:
    | {
        data: {
          session: Session;
        };
        error: null;
      }
    | {
        data: {
          session: null;
        };
        error: AuthError;
      }
    | {
        data: {
          session: null;
        };
        error: null;
      }
    | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  signInWithGoogle: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  signOut: Function | null;
  error: string | null;
  status: string;
};

const signInWithGoogle = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

const signOut = () => {
  console.log("trying to signout");
};

const defaultSession = {
  session: null,
  signInWithGoogle,
  signOut,
  error: null,
  status: "loading",
};

const sessionContext = createContext<SessionType>(defaultSession);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionType>(defaultSession);
  const [status, setStatus] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    const getCurrentSession = async () => {
      setStatus("loading");
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session?.user) {
          console.log(session);
          setStatus("authenticated");
          router.push('/notes')
        }
        if (error) {
          setStatus("unauthenticated");
          // add some redirection here
        }
      } catch (error) {
        console.log("Error while getting session");
        setStatus("unauthenticated");
        // might wanna logout user
      }
    };

    getCurrentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event == "SIGNED_IN" && newSession) {
        const { user_metadata } = newSession?.user;
        console.log(user_metadata);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <sessionContext.Provider value={{ ...session, status }}>{children}</sessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(sessionContext);

  if (!context) {
    throw new Error("useSession hook must be used within SessionProvider");
  }

  return context;
};
