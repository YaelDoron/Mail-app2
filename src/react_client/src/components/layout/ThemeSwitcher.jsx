import React, { createContext, useEffect, useState, useContext } from "react";

export const ThemeContext = createContext();

// ThemeProvider component to wrap the app and provide theme state
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});

  // Load the stored theme from localStorage when the component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Save the theme to localStorage and update the <body> attribute on change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Provide theme and toggle function to child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
