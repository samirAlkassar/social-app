"use client";

import { createContext, useContext } from "react";
import { useUserContext } from "./useUser";
import getCookies from "../actions/getCookies";

export const FriendsContext = createContext();

export function FriendsProvider({ children }) {
    const {setUser} = useUserContext();
    
    const toggleAddFriend = async (friendId,userId) => {
        try {
        const token = await getCookies("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/${friendId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`,
            },
        });
        if (!res.ok) {
            const errMsg = await res.text();
            throw new Error(`Failed: ${res.status} ${errMsg}`);
        }
        const formatedFriends = await res.json();
        setUser((prevUser) => ({
            ...prevUser,
            frinds: formatedFriends,
        }));

        } catch (error) {
            console.error("addRemoveFriend error:", error);
            res.status(500).json({ message: error.message });
        }
    };

    return (
        <FriendsContext.Provider value={{ toggleAddFriend }}>
        {children}
        </FriendsContext.Provider>
    );
}

// custom hook to consume context
export function useFreindsContext() {
  const context = useContext(FriendsContext);
  if (!context) throw Error("useFreindsContext must be used within a FriendsProvider");
  return context;
}
