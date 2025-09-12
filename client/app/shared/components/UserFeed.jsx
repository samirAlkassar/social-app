import PostCard from "./posts/PostCard";
import { useUserContext } from "@/app/context/useUser";
import React, { useState, useEffect, useRef } from "react";
import getCookies from "@/app/actions/getCookies";
import useInfiniteScroll from "@/app/hooks/observer.js";
import PostSkeleton from "@/app/shared/loading/PostSkeleton.jsx";

export const UserFeed = () => {
  const { user } = useUserContext();
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const limit = 5;

  const loaderRef = useRef(null); // target div for IntersectionObserver

  useEffect(() => {
    setHydrated(true);
    }, []);

  const getUserPosts = async (pageNum, limit) => {
    try {
        const token = await getCookies("token");
        const response = await fetch(
        `http://localhost:3001/posts/${user._id}/posts?limit=${limit}&page=${pageNum}`,
        {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token?.value}`,
            },
        }
        );

        const { post, pagination } = await response.json();
        setUserPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = post.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newPosts];
        });

        setPage(pagination.page);
        setHasMore(pagination.hasMore);
    } catch (error) {
        console.error("Error fetching user posts:", error);
    } finally {
        setLoadingPosts(false); // Make sure this is always called
    }
    };

  useEffect(() => {
    if (user && user._id) {
      getUserPosts(1, limit);
    }
  }, []);

  // Hook: trigger when sentinel is in view
    useInfiniteScroll({
    target: loaderRef,
    loading: loadingPosts,
    hasMore,
    onLoadMore: () => {
        if (hasMore && !loadingPosts) { // Add a check for hasMore and loading state
        setLoadingPosts(true);
        getUserPosts(page + 1, limit);
        }
    },
    offset: 0,
    });

    if (!hydrated) {
        return <div className="max-w-2xl w-full mx-auto mt-6 px-4">Loading...</div>;
        }

  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full mx-auto mt-6 pb-6 px-4">
      <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard key={post?._id} post={post} handleLike={()=>{}} user={user} addComment={()=>{}} toggleAddFriend={()=>{}}/>
            ))}
            {loadingPosts && (
              <>
              {[...Array(limit)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
              </>
            )}
          </div>

          {/* Load More */}
        
        {loadingPosts && (
            <div ref={loaderRef} className="flex justify-center my-2 h-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 border-t-transparent"></div>
            </div>
        )}
        

    </div>
  );
};
