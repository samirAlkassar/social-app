import {useState, useRef, useEffect} from "react";
import { MoreHorizontal } from "lucide-react";
import { useBookmarksContext } from "@/app/context/useBookmarks";
import { useUserContext } from "@/app/context/useUser";

const PostActions = ({deletePost, loadingDeletPost, post, toggleAddFriend, toggleBookmark}) => {
    const {bookmarks} = useBookmarksContext();
    const {user} = useUserContext();
    const [showPostActionsMenu, setShowPostActionsMenu] = useState(false)
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)
        ) {
          setShowPostActionsMenu(false);
        }
      }

      if (showPostActionsMenu) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },  [showPostActionsMenu]);
    
    return (
        <>
            <button ref={buttonRef}
                onClick={() => setShowPostActionsMenu((prev) => !prev)}
                className="p-1.5 relative cursor-pointer rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200"
                >
                <MoreHorizontal size={16} />
                </button>

            {/* Dropdown menu */}
            <div ref={menuRef}
                className={`bg-white border border-neutral-200 shadow-lg w-60 absolute top-16 right-6 rounded-lg z-10 flex flex-col 
                    transform transition-all duration-200 ease-out origin-top-right
                    ${showPostActionsMenu
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                {post?.userId !== user?._id && <button onClick={()=>{toggleAddFriend(post?.userId,user?._id) && setShowPostActionsMenu(false)}}
                    className="text-neutral-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-neutral-200 transition-all duration-75 ease-in rounded-t-lg">
                    {user?.frinds?.some(fr => (typeof fr === "string" ? fr : fr._id) === post?.userId) ? "Unfriend" : "Add friend"}
                </button>}

                {post?.userId === user?._id && <button
                    className="text-neutral-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-neutral-200 transition-all duration-75 ease-in rounded-t-lg">
                    Edit
                </button>}

                <button onClick={()=>{toggleBookmark(user?._id, post?._id) && setShowPostActionsMenu(false)}}
                   className="text-neutral-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-neutral-200 transition-all duration-75 ease-in">
                    {bookmarks.some(fr => (typeof fr === "string" ? fr : fr._id) === post?._id) ? "unsave" : "save"}
                </button>
                <button className="text-neutral-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-neutral-200 transition-all duration-75 ease-in">
                    Add to favourite
                </button>

                {post?.userId === user?._id && 
                <button onClick={deletePost}
                        className="text-red-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-red-100 transition-all duration-75 ease-in">
                    {loadingDeletPost? 
                        <span className="flex items-center justify-center gap-2">
                            Delete
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        </span>
                        : "Delete"} </button>}
                <button className="text-red-700 bg-neutral-50 cursor-pointer active:scale-[98%] py-3 hover:bg-red-100 transition-all duration-75 ease-in rounded-b-lg">
                    Report
                </button>
            </div>
        </>
    )
}

export default PostActions;