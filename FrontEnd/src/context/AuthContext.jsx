import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    API.get("users/me")
      .then((r) => {
        if (r.data.status === "ok") {
          setUser(r.data.data);
        } else {
          nav("/sign-in");
        }
      })
      .catch(() => {
        nav("/sign-in");
      });
  }, [nav]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
