import Post from "../models/post.js";
import User from "../models/User.js";
import cloudinary from "../utilities/cloudinary.js";
import Comment from "../models/Comment.js";

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Handle image upload (optional)
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts", // optional: group uploads inside a folder
      });
      imageUrl = result.secure_url;
    }

    // ✅ Create post
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath, // profile picture from user
      picturePath: imageUrl, // ✅ Cloudinary URL (or empty if no image)
      likes: {},
      comments: [],
    });

    await newPost.save();

    // ✅ Return updated feed
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Something went wrong while creating the post" });
  }
};


// READ
export const getFeedPosts = async (req, res) => {
  try {
    // get query params, default to page 1, limit 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // calculate skip
    const skip = (page - 1) * limit;

    // get posts with pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // newest first (optional)
      .skip(skip)
      .limit(limit);

    // get total count for pagination metadata
    const total = await Post.countDocuments();

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };

    res.status(200).json({ posts, pagination });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const post = await Post.find({ userId })
      .sort({ createdAt: -1 }) // newest first (optional)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ userId });
    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };

     // get userId from req params (frontend)
    res.status(200).json({post, pagination}); // return user's posts to frontend
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const { userId } = req.body;

    const post = await Post.findById(id); // ✅ Use Post (capital P)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { comment } = req.body;

    const newComment = new Comment({
      userId,
      postId: id,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      comment,
      likes: {},
      replies: [],
    });

    await newComment.save();

    // ✅ ensure comments array exists
    if (!post.comments) post.comments = [];
    post.comments.push(newComment._id);
    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("comments")
      .populate("userId");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ message: error.message });
  }
};




//like comment 
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params; // commentId
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // toggle like
    if (comment.likes.get(userId)) {
      comment.likes.delete(userId); // unlike
    } else {
      comment.likes.set(userId, true); // like
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reply to comment
export const addReply = async (req, res) => {
  try {
    const { id } = req.params; // parent commentId
    const {comment} = req.body
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parentComment = await Comment.findById(id);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const newReply = {
      userId,
      firstName: user.firstName,
      lastName :user.lastName,
      comment,
      userPicturePath: user.picturePath,
      likes: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    parentComment.replies.push(newReply);
    await parentComment.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getPostComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { postId } = req.params; // postId from the route param

    const skip = (page - 1) * limit;
    const comments = await Comment.find({postId})
      .sort({ createdAt: -1 }) // newest first (optional)
      .skip(skip)
      .limit(limit);

    // get total count for pagination metadata
    const total = await Comment.countDocuments({postId});
    
    // Find all comments that belong to this post
    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };

    res.status(200).json({comments,  pagination});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let userIds = [];

    if (post.likes instanceof Map) {
      // ✅ Mongoose Map
      userIds = Array.from(post.likes.keys());
    } else if (post.likes && typeof post.likes.toObject === "function") {
      // ✅ convert Mongoose object to plain object
      userIds = Object.keys(post.likes.toObject());
    } else if (typeof post.likes === "object" && post.likes !== null) {
      // ✅ plain JS object
      userIds = Object.keys(post.likes);
    }

    const users = await User.find({ _id: { $in: userIds } })
      .select("_id firstName lastName picturePath");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete post
export const deletePost = async (req, res) => {
  try {
    const { userId, id } = req.params;

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the owner
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete associated comments
    await Comment.deleteMany({ postId: id });

    // Optionally: delete image from cloudinary if exists
    // (requires storing cloudinary public_id in post model)
    await User.updateMany(
      { bookmarks: id },
      { $pull: { bookmarks: id } }
    );
    // Delete the post
    await Post.findByIdAndDelete(id);


    // Return updated posts
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


