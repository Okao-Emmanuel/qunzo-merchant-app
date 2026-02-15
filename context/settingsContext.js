"use client";

import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const network = new NetworkService();
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await network.globalGet(ApiPath.allSettings);
      setSettings(res.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
};
