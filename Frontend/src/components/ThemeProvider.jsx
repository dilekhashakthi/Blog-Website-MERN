import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme/themeSlice";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Sync immediately with the current OS preference
    dispatch(setTheme(mediaQuery.matches ? "dark" : "light"));

    // Listen for future OS-level changes
    const handleChange = (e) => {
      dispatch(setTheme(e.matches ? "dark" : "light"));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;