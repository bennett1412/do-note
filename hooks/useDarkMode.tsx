import { useState, useEffect } from "react";

const useDarkModeDetection = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleMode = () => {
    const mode = isDarkMode ? "light" : "dark";
    const nextRoot = document.getElementById("#__next");
    if (nextRoot) nextRoot.style.colorScheme = mode;
  };
  useEffect(() => {
    setIsDarkMode(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  return isDarkMode;
};

export default useDarkModeDetection;
