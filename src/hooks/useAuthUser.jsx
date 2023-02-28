import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase/init";
import { logout } from "../utils/firebase/init";
export function useProvideAuth() {
  const [user, setUser] = useState({ data: null, isLoading: true });
  useEffect(() => {
    console.log("i ran");
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

const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuthUser = () => {
  return useContext(authContext);
};
