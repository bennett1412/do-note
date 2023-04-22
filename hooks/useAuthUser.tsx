import React, {  ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import { logout } from "../utils/firebase/init";
import { AuthContextType, AuthStateType } from "@/types/Auth";

export function useProvideAuth() {
  const [user, setUser] = useState<AuthStateType>({
    data: null,
    isLoading: true,
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ data: user.toJSON(), isLoading: false });
      } else {
        setUser({ data: null, isLoading: false });
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, logout };
}

const authContext = createContext<AuthContextType>({
  user: { data: null, isLoading: false },
  logout: logout,
});

export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuthUser = () => {
  return useContext(authContext);
};
