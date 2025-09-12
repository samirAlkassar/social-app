"use client";

import { createContext, useState, useContext } from "react";

export const PostsContext = createContext();

export function PostsProvider({ children }) {
    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(false)
    

    return (
        <PostsContext.Provider value={{ posts, setPosts,loadingPosts ,setLoadingPosts }}>
        {children}
        </PostsContext.Provider>
    );
}

// custom hook to consume context
export function usePostsContext() {
  const context = useContext(PostsContext);
  if (!context) throw Error("usePostsContext must be used within a PostsProvider");
  return context;
}
