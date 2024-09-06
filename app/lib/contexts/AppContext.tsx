"use client";

import axiosInstance from "@/app/axiosInstance";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie } from "../cookies";

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  user: any;
  setUser: (user: any) => void;
  org: any;
  setOrg: (user: any) => void;
  getUser: () => void;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: "",
  setToken: (token: string) => {},
  user: {},
  setUser: (user: any) => {},
  org: {},
  setOrg: (org: any) => {},
  getUser: async () => {},
  logout: () => {},
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
});

export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>({});
  const [org, setOrg] = useState<any>({});
  const [token, setToken] = useState<string>(() => {
    const newToken = getCookie("token");
    return newToken ? newToken : "";
  });

  const logout = () => {
    setToken("");
    deleteCookie("token");
    setUser({});
    setOrg({});
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  const getUser = async () => {
    try {
      if (token) {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        );

        if (res.status === 200) {
          setUser(res.data);
          setIsLoggedIn(true);
          setToken(res.data.token);
          setOrg(res.data.organization);

          return res.data;
        }
      } else {
      }
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    getUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        logout,
        user,
        setUser,
        org,
        setOrg,
        getUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};
