import { Bookmark } from "lucide-react";
import { useState } from "react";

const BookmarksButton = ({disabled, post, bookmarks, onClick}) => {
    const postIssBookmarked = bookmarks.some(fr => (typeof fr === "string" ? fr : fr._id) === post?._id);
    const [optimisticUpdate, setOptimisticUpdate] = useState(null);
    const isBookmarked = optimisticUpdate !== null ? optimisticUpdate : Boolean(postIssBookmarked);

    const handleBookmark = () => {
        setOptimisticUpdate(!isBookmarked);
        onClick();
    }

    return (
         <button
            disabled={disabled}
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg cursor-pointer transition-all duration-200 sm:mr-0 mr-2
              ${ isBookmarked ? "text-primary hover:bg-primary/20" : "hover:bg-secondary"}`}
            >
            <Bookmark 
                size={18} 
                className={isBookmarked  ? 'fill-current' : ''} 
            />
        </button>
    )
}

export default BookmarksButton;