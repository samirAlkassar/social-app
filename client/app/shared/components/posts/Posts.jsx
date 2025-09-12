"use client"

import { useUserContext } from "@/app/context/useUser"; 
import React,  {useEffect, useState} from "react";
import getCookies from "@/app/actions/getCookies";
import Dropzone from "react-dropzone";
import { ProfileSection} from "../Sidebar.jsx";
import { FriendsSection} from "../Friends";
import useInfiniteScroll from "@/app/hooks/observer.js";
import PostSkeleton from "@/app/shared/loading/PostSkeleton.jsx";
import PostCard from "./PostCard.jsx";
import CreatPostSkeleton from "../../loading/CreatePostSkeleton.jsx";
import { usePostsContext } from "@/app/context/usePosts.jsx";

export const Posts = ({data, pagination, limit}) => {
  const {user, loading} = useUserContext();
  const {posts, setPosts ,loadingPosts ,setLoadingPosts } = usePostsContext();
  const [hasMore, setHasMore] = useState(pagination.hasMore || false);
  const [page, setPage] = useState(pagination.page || 1);
  
  //new post
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  const [loadingNewComment, setLoadingNewComment] = useState(false);

  

  useEffect(()=>{setPosts(data)},[])

  const createNewPost = async () => {
    try {
      setLoadingNewPost(true);
      const token = await getCookies("token");
      if (!token?.value) {
        alert("You must be logged in to post.");
        return;
        }
      const formData = new FormData();
      formData.append("userId", user?._id);
      formData.append("description", description);
      if (imagePath) {
        formData.append("image", imagePath);        
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token?.value}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", res.status, errorText);
        return;
      }

      const data = await res.json();

      console.log(data)
      setPosts(data);

    } catch (error) {
      console.log(error);
    } finally {
      setDescription("");
      setImagePath("");
      setLoadingNewPost(false);
    }
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
    <div className="min-h-[calc(100vh-59px)] bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      
      <div className="max-w-[90rem] mx-auto px-4 flex justify-baseline md:justify-center">
        {user && <ProfileSection currentUser={user}/>}
        {/* Header */}
        <div className="px-4 flex-2 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight mb-2">
              Latest Posts
            </h1>
            <p className="text-neutral-600">
              Stay connected with your community
            </p>
          </div>

          {/* Create Post Card */}
          
          {loading? <CreatPostSkeleton /> : user ? <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              
              {loading? 
              <div className="w-10 h-10 rounded-full border border-neutral-300/60 bg-neutral-300 animate-pulse" /> :
              <img
                  src={user?.picturePath ? user?.picturePath : "/images/profile-avatar-notfound.jpg"}
                  alt={user?.fireName || "avatar image"}
                  className="w-10 h-10 rounded-full border border-neutral-200/60"
                />
              }

              <textarea
                value={description}
                onChange={(e)=>{setDescription(e.target.value)}}
                type="text"
                placeholder="What's on your mind?"
                className="flex-1 px-4 py-3 rounded-xl max-h-28 min-h-14 bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImagePath(acceptedFiles[0])}>
                  {({ getRootProps, getInputProps }) => (
                    <button 
                      {...getRootProps()}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200 text-sm cursor-pointer"
                    >
                      <input {...getInputProps()} name="image" />
                      {imagePath ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{imagePath.name}</span>
                        </div>
                      ) : (
                        <>
                          📷 Photo
                        </>
                      )}
                    </button>
                  )}
                </Dropzone>
                
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200 text-sm">
                  📍 Location
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200 text-sm">
                  😊 Feeling
                </button>
              </div>
              
              <button 
                onClick={createNewPost} 
                disabled={!description.trim()}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200">
                {loadingNewPost? "Posting..." : "Post"}
              </button>
            </div>
          </div>: <p className="mb-3">login to be able to share Posts, <a href="/login" className="underline">Login</a></p>}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post?._id} post={post} setPosts={setPosts} user={user} loadingNewComment={loadingNewComment}/>
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




