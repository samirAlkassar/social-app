import express from "express";
import {getCurrentUser, getUser, getUserFriends, addRemoveFriend, addRemoveBookmark , getBookmarks} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/me", verifyToken, getCurrentUser);
router.get("/:id", getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE
router.patch("/:id/:friendsId", verifyToken, addRemoveFriend);
//add to bookmakrs
router.patch("/bookmarks/:id/:postId",verifyToken, addRemoveBookmark);
//get bookmarks
router.get("/bookmarks", verifyToken, getBookmarks);

export default router;
