"use client"

import { useUserContext } from "@/app/context/useUser"; 
import React,  {useEffect, useState} from "react";
import getCookies from "@/app/actions/getCookies";
import { ProfileSection} from "../Sidebar.jsx";
import { FriendsSection} from "../Friends";
import useInfiniteScroll from "@/app/hooks/observer.js";
import PostSkeleton from "@/app/shared/loading/PostSkeleton.jsx";
import PostCard from "./PostCard.jsx";
import CreatPostSkeleton from "../../loading/CreatePostSkeleton.jsx";
import { usePostsContext } from "@/app/context/usePosts.jsx";
import CreateNewPost from "./CreateNewPost.jsx";

export const Posts = ({data, pagination, limit}) => {

  const {user, loading} = useUserContext();
  const {posts, setPosts ,loadingPosts ,setLoadingPosts } = usePostsContext();
  const [hasMore, setHasMore] = useState(pagination.hasMore || false);
  const [page, setPage] = useState(pagination.page || 1);
  const [postBackgroundMode, setPostBackgroundMode] = useState(0)
  //new post

  const [loadingNewComment, setLoadingNewComment] = useState(false);

  

  useEffect(()=>{setPosts(data)},[])

    const postBackgroundModes = {
      0: "#ffffff", // plain white
      1: "linear-gradient(135deg, #4e54c8, #8f94fb)", // rich purple-blue
      2: "linear-gradient(135deg, #ff758c, #ff7eb3)", // deep pink-magenta
      3: "linear-gradient(135deg, #2193b0, #6dd5ed)", // cool ocean blue
      4: "linear-gradient(135deg, #c471f5, #fa71cd)", // violet-pink neon
      5: "linear-gradient(135deg, #f7971e, #ffd200)", // warm golden sunset
      6: "linear-gradient(135deg, #f53844, #42378f)", // fiery red to dark purple
      7: "linear-gradient(135deg, #11998e, #38ef7d)", // vibrant teal-green
      8: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" // dark sleek gradient
  };


  const getPosts = async (page, limit) => {
    try {
        setLoadingPosts(true);
        const token = await getCookies("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?${limit}&page=${page+1}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`, 
            },
        });
        if (!res.ok) {
            setError(data.msg || "Invalid credentials");
            return;
        }
        const data = await res.json();

        const existingIds = new Set(posts.map(post => post._id));
        const newPosts = data.posts.filter(post => !existingIds.has(post._id));
        setPosts(prev => [...prev, ...newPosts]);

        setPage(data.pagination.page);
        setHasMore(data.pagination.hasMore);

    } catch (error) {
        console.log(error)
    } finally {
        setLoadingPosts(false)
    }
  }


  useInfiniteScroll({
    loading: loadingPosts,   // instead of "loading"
    hasMore: hasMore,        // same as before
    onLoadMore: () => {      // wrap your loadMore logic
      setLoadingPosts(true);
      getPosts(page, limit).finally(() => setLoadingPosts(false));
    },
    offset: 100,
  });


  return (
    <div className="min-h-[calc(100vh-59px)] mobile:py-8 py-4">
      
      <div className="max-w-[90rem] mx-auto px-0 mobile:px-4 flex justify-baseline md:justify-center">
        {user && <ProfileSection currentUser={user}/>}
        {/* Header */}
        <div className="md:px-4 px-0 flex-2 max-w-2xl">
          <div className="md:mb-8 mb-2 md:px-0 px-2">
            <h1 className="md:text-3xl text-2xl font-semibold text-primary tracking-tight md:mb-2 mb-0">
              Latest Posts
            </h1>
            <p className="text-text/80 md:text-base text-sm">
              Stay connected with your community
            </p>
          </div>

          {/* Create Post Card */}
          
          {loading? <CreatPostSkeleton /> : user 
          ? <CreateNewPost  postBackgroundMode={postBackgroundMode} setPostBackgroundMode={setPostBackgroundMode} postBackgroundModes={postBackgroundModes} />
          : <p className="mb-3 px-2 md:px-0 text-sm md:text-base">
            login to be able to share Posts, 
            <a href="/login" className="underline">Login</a>
            </p>}

          {/* Posts Feed */}
          <div className="sm:space-y-6 space-y-4">
            {posts.map((post) => (
              <PostCard key={post?._id} post={post} setPosts={setPosts} user={user} loadingNewComment={loadingNewComment} postBackgroundModes={postBackgroundModes}/>
            ))} 
            {loadingPosts && (
              <>
              {[...Array(limit)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
              </>
            )}
            {posts.length === 0 && 
            <div className="w-full flex justify-center mt-10 relative">
              <img src="/images/404notfound.PNG" alt="no posts added yet!" className="scale-90"/>  
              <h3 className="text-center text-xl/tight font-extrabold text-neutral-600 bg-neutral-50 h-fit p-2 absolute top-55">No posts <br/>yet!</h3>
            </div>}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            {loadingPosts &&  <div className="h-6 w-6 animate-spin rounded-full border-2 mx-auto border-neutral-800 border-t-transparent" ></div>}
          </div>
        </div>
         {user && <FriendsSection/>}
      </div>
    </div>
  );
};




