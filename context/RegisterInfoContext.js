"use client";
import { createContext, useContext, useEffect, useState } from "react";

const RegisterInfoContext = createContext();

export const RegisterInfoProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    country: "",
    phone: "",
    referralCode: "",
  });

  useEffect(() => {
    const storedPersonalInfo = localStorage.getItem("register_personal_info");
    const storedAdditionalInfo = localStorage.getItem(
      "register_additional_info"
    );

    if (storedPersonalInfo) {
      setPersonalInfo(JSON.parse(storedPersonalInfo));
    }

    if (storedAdditionalInfo) {
      setAdditionalInfo(JSON.parse(storedAdditionalInfo));
    }
  }, []);

  useEffect(() => {
    if (
      personalInfo.first_name ||
      personalInfo.last_name ||
      personalInfo.username ||
      personalInfo.gender
    ) {
      localStorage.setItem(
        "register_personal_info",
        JSON.stringify(personalInfo)
      );
    }
  }, [personalInfo]);

  useEffect(() => {
    if (
      additionalInfo.country ||
      additionalInfo.phone ||
      additionalInfo.referralCode
    ) {
      localStorage.setItem(
        "register_additional_info",
        JSON.stringify(additionalInfo)
      );
    }
  }, [additionalInfo]);

  const clearRegistrationData = () => {
    localStorage.removeItem("register_personal_info");
    localStorage.removeItem("register_additional_info");
    setPersonalInfo({
      first_name: "",
      last_name: "",
      username: "",
      gender: "",
    });
    setAdditionalInfo({
      country: "",
      phone: "",
      referralCode: "",
    });
  };

  return (
    <RegisterInfoContext.Provider
      value={{
        personalInfo,
        setPersonalInfo,
        additionalInfo,
        setAdditionalInfo,
        clearRegistrationData,
      }}
    >
      {children}
    </RegisterInfoContext.Provider>
  );
};

export const useRegisterInfo = () => useContext(RegisterInfoContext);
