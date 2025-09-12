"use client";

import { createContext, useState, useContext } from "react";
import { useUserContext } from "./useUser";

export const BookmarksContext = createContext();

export function BookmarksProvider({ children }) {
    const {user, loading} = useUserContext();
    const [bookmarks, setBookmarks] = useState(user?.bookmarks || [])
    

    return (
        <BookmarksContext.Provider value={{ bookmarks, setBookmarks }}>
        {!loading && children}
        </BookmarksContext.Provider>
    );
}

// custom hook to consume context
export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) throw Error("useBookmarksContext must be used within a BookmarksProvider");
  return context;
}
