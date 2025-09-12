"use client";

import {useState, useEffect} from "react";
import { UserCheck, Heart, MessageCircle, Share, Bookmark, UserPlus, CornerDownLeft ,CornerUpLeft } from "lucide-react";
import CommentSkeleton from "../../loading/CommentSkeleton.jsx";
import Comment from "./Comment.jsx";
import getCookies from "@/app/actions/getCookies.js";
import PostActions from "../PostActions.jsx";
import formatTimeAgo from "@/app/hooks/formateDate.js";
import { useFreindsContext } from "@/app/context/useFriends.jsx";
import { useBookmarksContext } from "@/app/context/useBookmarks.jsx";
import { usePostsContext } from "@/app/context/usePosts.jsx";

export const PostCard = ({ post, user , loadingNewComment}) => {
    const {toggleAddFriend} = useFreindsContext();
    const {bookmarks, setBookmarks} = useBookmarksContext();
    const {setPosts} = usePostsContext();
    const [showComments, setShowComments] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [showMoreCaption, setShowMoreCaption] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [loadingLikes, setLoadingLikes] = useState(false)
    const [likes, setLikes] = useState([]);
    const [showLikes, setShowLikes] = useState(false);
    const [showPostBottomMenu, setShowPostBottomMenu] = useState(false);
    const [loadingDeletPost, setLoadingDeletPost] = useState(false);

    


    const captionLength = post?.description?.length || 0;

    const likePost = async () => {
      try {
        await handleLike(post._id);
        await getLikes(post._id);
      } catch (error) {
        console.log(error);
      }
    }
    
    const submitComment = async (commentPage) => {
      if (commentText.trim() === "") return;
      try {
        const result = await addComment(post._id, commentText);
        if (result){
          getComments(post._id, commentPage);
        }
        setCommentText("");
        return result
      } catch(error) {
        console.log(error)
      }
    }

    const UserExist = user === null ? true : false;

    const getComments = async (postId, commentPage = 1) => {
      try {
        setLoadingComments(true)
        const token = await getCookies("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments?page=${commentPage}&limit=5`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token?.value}`,
          },
        });
        if (!res.ok) {
          console.error("Failed to add comment");
          return;
        }
        const data = await res.json();
       setComments(prev =>
          [...prev, ...data.comments ].filter(
            (c, index, self) => index === self.findIndex(obj => obj._id === c._id)
          )
        );
        // 
        setHasMoreComments(data.pagination.hasMore)
        return data.comments
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingComments(false)
      }
    };


  const likeComment = async (commentId) => {
      try {
        const token = await getCookies("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${commentId}/like`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to like the post");
          return;
        }

        const updatedComment = await res.json();

        // update state with backend response
        setComments((prevComment) =>
          prevComment.map((c) =>
            c._id === commentId ? updatedComment : c
          )
        );

      } catch (error) {
        console.log(error);
      } 
    };

    const getLikes = async (postId) => {
          try {
            setLoadingLikes(true)
            const token = await getCookies("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`,
              },
            });

            if (!res.ok) {
              console.error("Failed to like the post");
              return;
            }

            const likes = await res.json();
            setLikes(likes.users)
            return likes

          } catch (error) {
            console.log(error);
          } finally {setLoadingLikes(false)}
        };

    useEffect(()=>{
        getLikes(post?._id);
    },[])


  

    const deletePost = async (userId, postId) => {
      try {
        setLoadingDeletPost(true)
        const token = await getCookies("token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${userId}/${postId}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`
          }
        })
         if (!res.ok) {
          alert("Failed to delete the post");
          return;
        }
        const updatedPosts = await res.json();
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
        return updatedPosts
      } catch(error) {
        console.log(error);
      } finally {
        setLoadingDeletPost(false)
      }
    }


    const loadMoreComments = () => {
      const nextPage = commentPage + 1;
      setCommentPage(nextPage);
      getComments(post._id, nextPage);  // Use nextPage instead of commentPage
    }

    const loadLessComments = async () => {
      setCommentPage(1);
      const firstPageComments = await getComments(post._id, 1);
      setComments((firstPageComments || []).slice(0, 5));
    }


    const toggleBookmark = async (userId, postId) => {
       try {
        const token = await getCookies("token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/bookmarks/${userId}/${postId}`,{
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`
          }
        })
         if (!res.ok) {
          alert("Failed to bookmark");
          return;
        }
        const updatedBookmarks = await res.json();
        setBookmarks(updatedBookmarks)
        return updatedBookmarks
      } catch(error) {
        console.log(error);
      } 
    }

    const handleLike = async (postId) => {
      try {
        const token = await getCookies("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.value}`,
          },
          body: JSON.stringify({ userId: user?._id }),
        });

        if (!res.ok) {
          console.error("Failed to like the post");
          return;
        }

        const updatedPost = await res.json();

        // update state with backend response
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? updatedPost : p
          )
        );

      } catch (error) {
        console.log(error);
      } 
    };

    const addComment = async (postId, comment) => {
      try {
      const token = await getCookies("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token?.value}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to add comment:", res.status, errText);
        return;
      }
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) =>  
        p._id === postId ? updatedPost : p
        )
      );
      // Add the new comment to the top of the comments list
      if (updatedPost.comments && updatedPost.comments.length > 0) {
        setComments(prev => [updatedPost.comments[updatedPost.comments.length - 1], ...prev]);
      }
      return updatedPost;
      } catch (error) {
      console.log(error);
      }
    };
    
    return (
        <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border border-neutral-200/60">
                <img
                    src={post.userPicturePath ? post?.userPicturePath : "/images/profile-avatar-notfound.jpg"}
                    alt={`${post.firstName} ${post.lastName}`}
                    className="absolute rounded-full z-10"
                />

                <span className={`absolute w-full h-full bg-conic/decreasing blur-sm animate-spin from-violet-700 opacity-0 via-lime-300 to-violet-700 rounded-full
                ${user?.frinds?.some(fr => (typeof fr === "string" ? fr : fr._id) === post?.userId) ? "pulse-once" : ""}`}/>
                
            </div>
              <div>
                  <h3 className="font-medium text-neutral-900">
                  {post.firstName} {post.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>location</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdAt, " new")}</span>

                  </div>
              </div>
            </div>
            
            {user && <div className="flex items-center gap-2">
            {post?.userId === user?._id ? null :
            <button onClick={()=>{toggleAddFriend(post?.userId,user?._id)}} className={`p-1.5 cursor-pointer rounded-lg transition-all duration-200 ${user?.frinds?.some(fr => (typeof fr === "string" ? fr : fr._id) === post?.userId) ? 'bg-cyan-200 text-cyan-600 hover:bg-cyan-300' : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800'}`}>
                {user?.frinds?.some(fr => (typeof fr === "string" ? fr : fr._id) === post?.userId) ? <UserCheck size={16} />:<UserPlus size={16} />}
            </button>}
            {/* deletePost(user._id, post._id) */}
              <PostActions 
                toggleAddFriend={toggleAddFriend} 
                post={post}  
                deletePost={()=>{deletePost(user._id, post._id)}} 
                loadingDeletPost={loadingDeletPost}
                toggleBookmark={toggleBookmark}/>

            </div>}
        </div>

        {/* Post Content */}
        <div className="mb-4">
            <p className={`text-neutral-800 leading-relaxed mb-1 ${showMoreCaption? "" : "line-clamp-3"}`}>
            {post.description} 
            </p>
            {captionLength > 310 && <button onClick={()=>{setShowMoreCaption(!showMoreCaption)}} className="mb-2 text-sm underline cursor-pointer hover:text-cyan-700 text-cyan-600">{showMoreCaption? "show less" : "show more"}</button>}
            
            {post.picturePath && (
            <div className="relative rounded-xl overflow-hidden">
                <img
                src={post.picturePath || "/images/profile-avatar-notfound.jpg"}
                alt="Post content"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>
            )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50">
            <div className="flex items-center gap-4">
            <button
                disabled={UserExist}
                onClick={likePost}
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 ${
                user && likes.some(like => (typeof like === "string" ? like : like._id) === user._id)
                    ? 'text-red-600 hover:bg-red-100' 
                    : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800'
                }`}
            >
                <Heart 
                size={16} 
                className={'fill-current'} 
                />
                <span className="text-sm font-medium min-w-2"> {(likes?.length) > 0 ? likes?.length : ""}</span>
            </button>
            
            <button onClick={()=>{setShowPostBottomMenu(!showPostBottomMenu); getComments(post?._id, commentPage)}} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200">
                <MessageCircle size={16} />
                <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </button>
            
            <button disabled={UserExist} className="flex items-center gap-2 px-3 cursor-pointer py-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200">
                <Share size={16} />
                <span className="text-sm font-medium">Share</span>
            </button>
            </div>
            
            <button
            disabled={UserExist}
            onClick={() => toggleBookmark(user?._id, post?._id)}
            className={`p-1.5 rounded-lg cursor-pointer transition-all duration-200 
              ${bookmarks.some(fr => (typeof fr === "string" ? fr : fr._id) === post?._id)  ? "text-blue-500" : ""}`}
            >
            <Bookmark 
                size={16} 
                className={bookmarks.some(fr => (typeof fr === "string" ? fr : fr._id) === post?._id)  ? 'fill-current' : ''} 
            />
            </button>
        </div>
        {showPostBottomMenu && <div className="mt-4">
          <div className="flex gap-4 border-b border-neutral-200 pb-1">
            <button 
            className={`p-1 rounded-md active:scale-95 w-26 text-center cursor-pointer ${showComments? "bg-neutral-100 text-neutral-700 " : "bg-neutral-50 text-neutral-600"}`}
            onClick={()=>{getComments(post?._id, commentPage); setShowLikes(false); setShowComments(!showComments)}}>Comments</button>
            <button 
            className={`p-1 rounded-md active:scale-95 w-26 cursor-pointer ${showLikes? "bg-neutral-100 text-neutral-700" : "bg-neutral-50 text-neutral-600"}`}
            onClick={()=>{getLikes(post?._id); setShowComments(false); setShowLikes(true)}}>Likes</button>
          </div>
           {showComments && 
           <>
            {loadingComments? 
                <div className="space-y-2">
                {[...Array(comments?.length)].map((_, index) => (
                    <CommentSkeleton key={index} />
                ))}
                </div>:

            <div className="space-y-2">
            {Array.isArray(comments) && comments.length === 0 && <p className="text-sm text-neutral-500 mt-2">No comments yet. Be the first to comment!</p>}
            {Array.isArray(comments) && comments.map((comment) => (
                <Comment key={comment?._id} comment={comment} likeComment={likeComment} user={user}/>
                ))}
                <div className="flex gap-4">
                {hasMoreComments && 
                <button 
                className="flex gap-1 items-center text-cyan-700 hover:underline cursor-pointer"
                onClick={loadMoreComments}>
                    <p>show more</p>
                    <CornerDownLeft size={16}/>
                </button>}
                {comments.length > 5 && 
                <button 
                className="flex gap-1 items-center text-cyan-700 hover:underline cursor-pointer"
                onClick={loadLessComments}>
                    <p>show less</p>
                    <CornerUpLeft size={16}/>
                </button>}
                </div>
            </div>}
            </>}
          {showLikes && <div className="mt-2">
          
            <div className="mt-2 p-1 space-y-2">
              {loadingLikes ?
              <div className="mt-2 p-1 space-y-2">
                {[...Array(Object.keys(post?.likes || {}).length)].map((_,index)=>(
                  <div key={index} className="flex gap-2 items-center">
                    <span className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse"></span>
                    <span className="w-30 h-6 rounded-md bg-neutral-200 animate-pulse"></span>
                  </div>
                ))}

              </div>:
              <>
              {likes.map((like)=>(
                <div key={like._id} className="flex gap-2 items-center">
                  <div className="relative h-8 w-8 rounded-full border border-neutral-400 overflow-clip">
                    <img src={like.picturePath} 
                          alt="user image"
                          className="absolute w-full h-full object-fill" />
                  </div>
                  <h4>{like.firstName} {like.lastName}</h4>
                </div>
              ))}
              </>}
              {(Object.keys(post?.likes || {}).length) === 0 && <p className="text-sm text-neutral-500 mt-2">No likes yet. Be the first to like!</p>}

            </div>
          </div>}

        </div>}
        {/* Likes */}


        <AddCommentForm 
            commentText={commentText}
            setCommentText={setCommentText}
            onClick={()=>submitComment(commentPage)}
            disabled={UserExist}
            loadingNewComment={loadingNewComment} />
    </div>
)};

export const AddCommentForm = ({commentText, setCommentText, onClick, disabled, loadingNewComment}) => {
    return (
    <div className="flex items-center gap-2 mt-3">
        <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200 text-sm"
        />
        <button disabled={disabled} onClick={onClick} className="px-3 py-2 cursor-pointer bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200">{loadingNewComment? "Post..." : "Post"}</button>
    </div>
    )
}

export default PostCard;