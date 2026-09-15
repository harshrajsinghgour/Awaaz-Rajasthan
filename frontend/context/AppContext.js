"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState("राजस्थान");

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme =
      localStorage.getItem("awaaz-theme");

    const savedDistrict =
      localStorage.getItem("awaaz-district");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }

    if (savedDistrict) {
      setSelectedDistrict(savedDistrict);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      "awaaz-theme",
      darkMode ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  const changeDistrict = (district) => {
    setSelectedDistrict(district);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "awaaz-district",
        district
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode,

    user,
    setUser,

    selectedDistrict,
    setSelectedDistrict,
    changeDistrict,

    searchOpen,
    setSearchOpen
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}
