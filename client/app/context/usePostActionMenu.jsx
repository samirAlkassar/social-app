"use client";

import { createContext, useState, useContext } from "react";

export const PostActionsMenuContext = createContext();

export function PostActionsMenuProvider({ children }) {
    const [showPostActionsMenu, setShowPostActionsMenu] = useState(false)

    return (
        <PostActionsMenuContext.Provider value={{ showPostActionsMenu, setShowPostActionsMenu }}>
        {children}
        </PostActionsMenuContext.Provider>
    );
}

// custom hook to consume context
export function usePostActionsMenuContext() {
  const context = useContext(PostActionsMenuContext);
  if (!context) throw Error("usePostActionsMenuContext must be used within a PostActionsMenuProvider");
  return context;
}
