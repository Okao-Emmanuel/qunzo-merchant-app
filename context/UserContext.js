"use client";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const network = new NetworkService();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await network.get(ApiPath.user);
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  const refreshUser = () => {
    fetchUser();
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      const res = await network.post(ApiPath.logout, {});
      Cookies.remove("token");
      Cookies.remove("kycVerify");
      Cookies.remove("personalInfo");
      setUser(null);
      router.push("/auth/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        refreshUser,
        fetchUser,
        logout,
        logoutLoading,
        setLogoutLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
