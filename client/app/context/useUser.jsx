"use client";

import { createContext, useState, useEffect, useContext } from "react";
import getCookies from "@/app/actions/getCookies";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;

    const getUser = async () => {
      try {
        setLoading(true);
        const token = await getCookies("token");

        if (!token?.value) {
          setUser(null);
          return;
        }

        const res = await fetch("http://localhost:3001/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.value}`,
          },
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser(data.user);
      } catch (error) {
        console.error("User fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [hydrated]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

// custom hook to consume context
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw Error("useUserContext must be used within a UserProvider");
  return context;
}
