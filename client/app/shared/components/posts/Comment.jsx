"use client";

import { useState } from "react";
import {Heart,Reply } from "lucide-react";
import getCookies from "@/app/actions/getCookies";
import formatTimeAgo from "@/app/hooks/formateDate";

const Comment = ({comment, likeComment, user}) => {
    const [liked, setLiked] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [showReplayForm, setShowReplayForm] = useState(false);
    const [reply, setReply] = useState("");

    
    const toggleLikeComment = () => {
        setLiked(!liked);
        likeComment(comment._id);
    }
    const addReplay = async (commentId, comment) => {
        try {
            const token = await getCookies("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/comments/${commentId}/replies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`,
            },
            body: JSON.stringify({comment})
            });

            if (!res.ok) {
            console.error("Failed to Replay to the post");
            return;
            }

            const data = await res.json();
            return data

        } catch (error) {
            console.log(error);
        } 
        };
        
        

        const addNewReplay = async () => {
        if (reply.trim() === "") return;
        try {
            const result = await addReplay(comment?._id, reply);
            console.log(result)
            if (result) {
            comment.replies = [...(comment.replies || []), result];

            setShowReplay(true);
            }
            setReply("");
            setShowReplayForm(false)

            return result;
        } catch (error) {
            console.log(error);
        }
        };

        
    return (
        <div className="ml-4 border-l pl-2 border-border flex gap-2 py-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border-1 border-neutral-500">
                <img
                    src={comment.userPicturePath || "./images/profile-avatar-notfound.jpg"}
                    alt={`${comment.firstName} ${comment.lastName}`}
                    className="absolute object-cover h-full w-full"
                />
            </div>
            <div className="w-full">
                <div className="flex gap-2 items-center">
                    <p className="text-sm font-semibold">
                        {comment?.firstName} {comment?.lastName}
                    </p>
                    <p className="text-xs text-text-muted">
                        {formatTimeAgo(comment.createdAt)}
                    </p>
                </div>
                <p className="text-sm text-text">{comment?.comment}</p>
                <div className="flex gap-4 items-center mt-2">
                    <button
                        className={`flex gap-1 items-center justify-center cursor-pointer ${
                            comment.likes && user && comment.likes[user._id]
                                ? "text-red"
                                : "text-text-muted"
                        }`}
                        onClick={user && toggleLikeComment}
                    >
                        <Heart size={16} className={"fill-current"} />
                        <p className="text-xs text-text min-w-2">
                            {(Object.keys(comment?.likes || {}).length) > 0 ? (Object.keys(comment?.likes || {}).length) : ""}
                        </p>
                    </button>

                    <button
                        onClick={() => {user && setShowReplayForm(!showReplayForm)}}
                        className="flex gap-1 items-center justify-center cursor-pointer">
                        <Reply size={16} className="text-text" />
                        <p className="text-xs text-text">Reply</p>
                    </button>
                </div>
                
                {(Object.keys(comment?.replies || {}).length) !== 0 &&
                <button onClick={()=>{setShowReplay(!showReplay); showReplayForm && setShowReplayForm(!showReplayForm)}} className="flex items-center gap-2 mt-2 cursor-pointer">
                    <span className="w-8 h-[0.2px] bg-card"></span>
                    <span className="text-sm text-text">{showReplay ? "hide replies" : "view replies"}</span>
                    {!showReplay && <span className="text-sm text-text">{"("}{Object.keys(comment?.replies || {}).length}{")"}</span>}
                </button>}
                    

                {showReplayForm && (
                    <ReplyToCommentForm
                        user={user}
                        comment={comment}
                        reply={reply}
                        setReply={setReply}
                        addNewReplay={addNewReplay}
                    />
                )}
                {showReplay && <div className="mt-2 space-y-2">
                    
                    {(comment?.replies || []).map((reply, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg p-2">
                            <div className="relative min-h-8 min-w-8 overflow-hidden rounded-full border border-neutral-300">
                                <img
                                    src={reply.userPicturePath || "./images/profile-avatar-notfound.jpg"}
                                    alt={reply.firstName ? `${reply.firstName} ${reply.lastName}` : "User"}
                                    className="absolute object-cover h-full w-full"/>
                            </div>
                            <div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm font-semibold text-text">
                                        {reply.firstName} {reply.lastName}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {reply.createdAt
                                            ? formatTimeAgo(reply.createdAt)
                                            : ""}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-700">{reply.comment}</p>

                                <div className="flex gap-4 items-center mt-2">
                                    <button
                                        className="flex gap-1 items-center justify-center cursor-pointer text-text-muted">
                                        <Heart size={16} className={"fill-current"} />
                                        <p className="text-xs text-text">0</p>
                                    </button>

                                    <button className="flex gap-1 items-center justify-center cursor-pointer">
                                        <Reply size={16} className="text-text" />
                                        <p className="text-xs text-text">Reply</p>
                                    </button>
                                </div>

                            </div>
                            
                        </div>
                    ))}
                    
                </div>}
            </div>
        </div>
    );
}

const ReplyToCommentForm = ({user, comment, reply, setReply, addNewReplay}) => {
    return (
        <div className="mt-4 flex gap-2 items-center p-2 rounded-md">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border-1 border-neutral-500">
                <img src={user.picturePath || "./images/profile-avatar-notfound.jpg"} 
                alt={`${user.firstName} ${user.lastName}`} 
                className="absolute object-cover h-full w-full"/>
            </div>
            <div className="flex gap-2 w-full">
                <input 
                    type="text" 
                    placeholder={`Reply to @${comment.firstName}_${comment.lastName}`}
                    value={reply}
                    onChange={(e)=>{setReply(e.target.value)}}
                    className="w-full p-2 bg-secondary rounded-lg border border-border text-text placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-200 focus:border-transparent transition-all duration-200 text-sm placeholder:text-[13px]"/>
                <button 
                    onClick={addNewReplay}
                    className="cursor-pointer bg-foreground hover:bg-foreground/80 text-border-muted text-sm px-3 rounded-xl transition-colors duration-150 ease-in-out">Post</button>
            </div>
            
        </div>
    )
}

export default Comment;

