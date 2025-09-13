import { Heart } from "lucide-react";
import { useUserContext } from "@/app/context/useUser";

const LikeButton = ({disabled, onClick, likes}) => {
    const {user} = useUserContext();
    const postIsLiked = user && likes.some(like => (typeof like === "string" ? like : like._id) === user._id)
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 ${
                postIsLiked
                    ? 'text-red hover:bg-red-100' 
                    : 'hover:bg-secondary-hover text-text hover:text-text'
                }`}>
            <div className="relative">
                <Heart size={16} className={`${postIsLiked  && "fill-current"}`}/>
                <HeartAnimation postIsLiked={postIsLiked}/>
            </div>
            <span className="text-sm font-medium min-w-2">  {(likes?.length) > 0 ? likes?.length : ""}</span>
        </button>
    )
}

export default LikeButton;


const HeartAnimation = ({postIsLiked}) => {
    return (
        <div className={`top-0 left-0 ${postIsLiked ? "pulse-like-effect absolute" : "hidden"}`}>
            <Heart size={16} className="fill-current"/>
        </div>
    )
}