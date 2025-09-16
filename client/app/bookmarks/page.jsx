"use client";

import { useUserContext } from "../context/useUser";
import PostCard from "../shared/components/posts/PostCard";
import {useEffect, useState} from "react"
import getCookies from "../actions/getCookies";
import PostSkeleton from "../shared/loading/PostSkeleton";
import { useBookmarksContext } from "../context/useBookmarks";
import { ArrowLeftCircle } from "lucide-react";
import { usePostsContext } from "../context/usePosts";
import { Navbar } from "../shared/components/Navbar";

export const Bookmarks = () => {
    const {user} = useUserContext();
    const {bookmarks, setBookmarks} = useBookmarksContext();
    const {setPosts} = usePostsContext();
    const [loadingBookmarks, setLoadingBookmarks] = useState(false);
    const [bookmarksArray, setBookmarksArray] = useState([])

    const getBookmarks = async (id) => {
        try {
            setLoadingBookmarks(true);
            const token = await getCookies("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/bookmarks/${id}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`, 
                },
            });
            if (!res.ok) {
                setError(data.msg || "Failed to get bookmarks");
                return;
            }
            const data = await res.json();
            setBookmarksArray(data)
            return data

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingBookmarks(false)
        }
    }

    useEffect(()=>{
        getBookmarks(user?._id)
    },[bookmarks])

    const postBackgroundModes = {
        0: "linear-gradient(#ffffff00)", // rich purple-blue
        1: "linear-gradient(135deg, #4e54c8, #8f94fb)", // rich purple-blue
        2: "linear-gradient(135deg, #ff758c, #ff7eb3)", // deep pink-magenta
        3: "linear-gradient(135deg, #2193b0, #6dd5ed)", // cool ocean blue
        4: "linear-gradient(135deg, #c471f5, #fa71cd)", // violet-pink neon
        5: "linear-gradient(135deg, #f7971e, #ffd200)", // warm golden sunset
        6: "linear-gradient(135deg, #f53844, #42378f)", // fiery red to dark purple
        7: "linear-gradient(135deg, #11998e, #38ef7d)", // vibrant teal-green
        8: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" // dark sleek gradient
    };
    return (
        <>

            {loadingBookmarks ? (
                <div className="space-y-6 my-6">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
                
            ) : (
                <div className="space-y-6 my-6">
                    {bookmarksArray.length === 0 ? (
                        <p className="text-center text-lg text-neutral-700">No bookmarks found!</p>
                    ) : (
                        bookmarksArray.map((post, index) => (
                            (post) === null ? 
                                <div key={index} className="bg-neutral-300  rounded-lg p-4  flex items-center justify-between">
                                    <p className="text-base text-neutral-800">This post was deleted by the user ⚠️</p>
                                    <button className="text-sm">Remove</button>
                                </div>:
                                <PostCard key={post._id} post={post} bookmarks={bookmarks} user={user} setBookmarks={setBookmarks} setPosts={setPosts} postBackgroundModes={postBackgroundModes}  />
                            
                        ))
                    )}
                </div>
            )}

        </>
    )
}


const BookmarksPage = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-6 max-w-2xl w-full mx-auto mt-6 pb-6 sm:px-4 px-0">
                <h1 className="text-xl text-neutral-700 font-semibold text-center mt-4">Bookmarks</h1>
                <a className="flex gap-2 items-center hover:text-cyan-800" href="/"><ArrowLeftCircle /> <span>go back</span></a>
                <Bookmarks />
            </div>
        </>
    )
}

export default BookmarksPage;