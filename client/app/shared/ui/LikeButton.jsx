import { useState, useEffect } from "react";

import { Heart } from "lucide-react";
import { useUserContext } from "@/app/context/useUser";

const LikeButton = ({disabled, onClick, likes}) => {
    const {user} = useUserContext();
    const postIsLiked = user && likes.some(like => (typeof like === "string" ? like : like._id) === user._id);
    const [optimisticUpdate, setOptimisticUpdate] = useState(null);
    const [optimisticCounter, setOptimisticCounter] = useState(() => likes?.length ?? 0);
    const isLiked = optimisticUpdate !== null ? optimisticUpdate : Boolean(postIsLiked);
    const numberOfLikes = likes?.length > 0 ? likes?.length : "";
    useEffect(() => {
        setOptimisticCounter(likes?.length ?? 0);
    }, [likes?.length]);
    const handleLike = async () => {
        if (!user) return;

        const nextLiked = !isLiked;

        // optimistic UI updates
        setOptimisticUpdate(nextLiked);
        setOptimisticCounter((prev) => prev + (nextLiked ? 1 : -1));

        // call parent mutation (onClick may return a promise)
        try {
        const res = onClick && onClick(); // call mutation
        if (res && typeof res.then === "function") {
            await res; // wait for server; when parent updates likes prop, useEffect will sync
        }
        } catch (err) {
        // rollback on error
        setOptimisticUpdate(null);
        setOptimisticCounter(likes?.length ?? 0);
        console.error("Like mutation failed — rolled back optimistic UI", err);
        }
    };
    return (
        <button
            disabled={disabled}
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 ${
                isLiked
                    ? 'text-red hover:bg-red/20' 
                    : 'hover:bg-secondary-hover text-text hover:text-text'
                }`}>
            <div className="relative">
                <Heart size={18} className={`${isLiked  && "fill-current"}`}/>
                <HeartAnimation optimisticUpdate={optimisticUpdate}/>
            </div>
            <span className="text-sm font-medium min-w-2">  {optimisticCounter > 0 ? optimisticCounter : ""}</span>
        </button>
    )
}

export default LikeButton;


const HeartAnimation = ({optimisticUpdate}) => {
    return (
        <div className={`top-0 left-0 ${optimisticUpdate ? "pulse-like-effect absolute" : "hidden"}`}>
            <Heart size={16} className="fill-current"/>
        </div>
    )
}