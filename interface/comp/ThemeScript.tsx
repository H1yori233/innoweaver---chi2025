'use client';

import React, { useEffect } from "react";

const ThemeScript = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferredTheme =
      savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.body.className = preferredTheme;

    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail;
      document.body.className = newTheme;
      console.log(newTheme);
      localStorage.setItem("theme", newTheme);
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange as EventListener);
    };
  }, []);

  return null;
};

export default ThemeScript;
