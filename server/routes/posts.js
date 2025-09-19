import express from "express";
import {getFeedPosts, getUserPosts, likePost, addComment, likeComment, addReply, getPostComments, getLikes, deletePost} from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js"

const router = express.Router();

// READ
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);

//get Likes
router.get("/:id/like", getLikes)

//get post comments
router.get("/:postId/comments", getPostComments)

router.patch("/comments/:id/like", verifyToken, likeComment);
router.post("/comments/:id/replies", verifyToken, addReply);

//Delet post
router.delete("/:userId/:id",verifyToken, deletePost)

// router.patch("/comments/:commentId/replies/:replyId/like", verifyToken, likeReply);
export default router;