import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { useBookmarksContext } from "@/app/context/useBookmarks";
import { useUserContext } from "@/app/context/useUser";
import { createPortal } from "react-dom";

const PostActions = ({
  deletePost,
  loadingDeletPost,
  post,
  toggleAddFriend,
  toggleBookmark,
}) => {
  const { bookmarks } = useBookmarksContext();
  const { user } = useUserContext();

  const [showPostActionsMenu, setShowPostActionsMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !buttonRef.current?.contains(event.target) &&
        !mobileMenuRef.current?.contains(event.target) &&
        !dropdownMenuRef.current?.contains(event.target)
      ) {
        setShowPostActionsMenu(false);
      }
    }

    if (showPostActionsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      // prevent body scroll only on mobile fullscreen menu
      if (window.innerWidth < 640) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [showPostActionsMenu]);

  return (
    <>
      <div>
        <button
          ref={buttonRef}
          onClick={() => setShowPostActionsMenu((prev) => !prev)}
          className="sm:p-1.5 p-3 relative cursor-pointer rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800 transition-all duration-200"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Mobile fullscreen menu (portal) */}
      {showPostActionsMenu &&
        createPortal(
          <div
            ref={mobileMenuRef}
            className="sm:hidden fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center"
          >
            <PostActionsMenu
              setShowPostActionsMenu={setShowPostActionsMenu}
              toggleAddFriend={toggleAddFriend}
              bookmarks={bookmarks}
              user={user}
              post={post}
              loadingDeletPost={loadingDeletPost}
              deletePost={deletePost}
              toggleBookmark={toggleBookmark}
            />
          </div>,
          document.body
        )}

      {/* Desktop dropdown menu */}
      <div
        ref={dropdownMenuRef}
        className="hidden sm:block absolute top-8 right-2 z-50"
      >
        {showPostActionsMenu && (
          <PostActionsMenu
            setShowPostActionsMenu={setShowPostActionsMenu}
            toggleAddFriend={toggleAddFriend}
            bookmarks={bookmarks}
            user={user}
            post={post}
            loadingDeletPost={loadingDeletPost}
            deletePost={deletePost}
            toggleBookmark={toggleBookmark}
          />
        )}
      </div>
    </>
  );
};

const PostActionsMenu = ({
  setShowPostActionsMenu,
  toggleAddFriend,
  bookmarks,
  user,
  post,
  loadingDeletPost,
  deletePost,
  toggleBookmark,
}) => {
  const isFriend = user?.friends?.some(
    (fr) => (typeof fr === "string" ? fr : fr._id) === post?.userId
  );
  const isBookmarked = bookmarks.some(
    (b) => (typeof b === "string" ? b : b._id) === post?._id
  );

  return (
    <div className="bg-card border border-border shadow-lg w-60 rounded-lg flex flex-col transform transition-all duration-200 ease-out origin-top-right">
      {/* Add friend / Unfriend */}
      {post?.userId !== user?._id && (
        <button
          onClick={() => {
            toggleAddFriend(post?.userId, user?._id);
            setShowPostActionsMenu(false);
          }}
          className="text-text bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-secondary transition-all duration-75 ease-in rounded-t-lg"
        >
          {isFriend ? "Unfriend" : "Add friend"}
        </button>
      )}

      {/* Edit (if owner) */}
      {post?.userId === user?._id && (
        <button className="text-text bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-secondary transition-all duration-75 ease-in rounded-t-lg">
          Edit
        </button>
      )}

      {/* Bookmark */}
      <button
        onClick={() => {
          toggleBookmark(user?._id, post?._id);
          setShowPostActionsMenu(false);
        }}
        className="text-text bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-secondary transition-all duration-75 ease-in"
      >
        {isBookmarked ? "Unsave" : "Save"}
      </button>

      <button className="text-text bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-secondary transition-all duration-75 ease-in">
        Add to favourite
      </button>

      {/* Delete (if owner) */}
      {post?.userId === user?._id && (
        <button
          onClick={deletePost}
          className="text-red bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-red/10 transition-all duration-75 ease-in"
        >
          {loadingDeletPost ? (
            <span className="flex items-center justify-center gap-2">
              Delete
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </span>) : (
            "Delete")}
        </button>)}

      <button className="text-red bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-red/10 transition-all duration-75 ease-in">
        Report
      </button>

      {/* Cancel (only mobile) */}
      <button
        onClick={() => setShowPostActionsMenu(false)}
        className="text-text sm:hidden block bg-card cursor-pointer active:scale-[98%] py-3 hover:bg-red/10 transition-all duration-75 ease-in rounded-b-lg"
      >
        Cancel
      </button>
    </div>
  );
};

export default PostActions;
