import { createSlice } from "@reduxjs/toolkit";

// Detect OS-level dark mode preference for the initial load.
// After first load, redux-persist takes over and stores the user's choice.
const getInitialTheme = () => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggoleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload; // 'light' | 'dark'
    },
  },
});

export const { toggoleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;