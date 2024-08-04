import React, { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import { logout } from "../utils/firebase/init";
import { supabase } from "@/utils/supabase/init";
import { AuthError, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

interface User {
  id?: string,
  name?: string, 
  email?: string,
  picture?: string,
};

type SessionType = {
  user: User;
  // eslint-disable-next-line @typescript-eslint/ban-types
  signInWithGoogle: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  signOut: Function;
  error: string | null;
  status: string;
};

const signInWithGoogle = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

const signOut = () => {
  supabase.auth.signOut();
};

const defaultSession = {
  user: {
    id: "",
    name: "",
    email: "",
    picture: ""
  },
  signInWithGoogle,
  signOut,
  error: null,
  status: "loading",
};

const sessionContext = createContext<SessionType>(defaultSession);

export function SessionProvider({ children }: { children: ReactNode }) {
  // const [session, setSession] = useState<SessionType>(defaultSession);
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    picture: ""
  });
  const router = useRouter();
  useEffect(() => {
    const setUserData = (userData: User | void) => {
      setUser({
        id : userData?.id ?? "",
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        picture: userData?.picture ?? ""
      })
    }
    const getCurrentSession = async () => {
      setStatus("loading");
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session?.user) {
          setStatus("authenticated");
          setUserData({
            id: session?.user.id,
            name: session?.user.user_metadata.name,
            email: session?.user.email,
            picture: session?.user.user_metadata.picture
          });
          router.push("/notes");
        }else{
          setStatus("unauthenticated");
          setUserData()
          if (error) {
            // # todo: add some instruction here

          }
        }    
      } catch (error) {
        setStatus("unauthenticated");
        // might wanna logout user
      }
    };

    getCurrentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      switch (event) {
        case "SIGNED_IN":
          
          setUser({
            id: newSession?.user.id,
            name: newSession?.user.user_metadata.name,
            email: newSession?.user.email,
            picture: newSession?.user.user_metadata.picture
          })
          break;
        case "SIGNED_OUT":
          setStatus("unauthenticated");
          router.push("/auth");
          break;
        default:
          break;
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <sessionContext.Provider value={{ ...defaultSession, status, user }}>{children}</sessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(sessionContext);

  if (!context) {
    throw new Error("useSession hook must be used within SessionProvider");
  }

  return context;
};
