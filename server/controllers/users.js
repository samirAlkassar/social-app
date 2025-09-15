import User from "../models/User.js"
import Post from "../models/post.js";

// READ
export const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;

    // Only select safe fields (avoid password, etc.)
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const {id} = req.params;

    // Only select safe fields (avoid password, etc.)
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserFriends = async (req, res) => {
    try {
    const {id} = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
        user.frinds.map((id)=> User.findById(id))
    );
    const formattedFriends = friends.map(
        ({_id, firstName, lastName, occupation, location, picturePath})=> {
            return {_id, firstName, lastName, occupation, location, picturePath};
        }
    );
    res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({message: error.message})
    }

};

//update 
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendsId } = req.params; 
    const user = await User.findById(id);
    const friend = await User.findById(friendsId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user || !friend) {
      return res.status(404).json({ message: "User or Friend not found" });
    }
    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ message: "Cannot add/remove yourself as a friend" });
    }
    if (user.frinds.includes(friendsId)) {
      // remove
      user.frinds = user.frinds.filter(fid => fid.toString() !== friendsId.toString());
      friend.frinds = friend.frinds.filter(fid => fid.toString() !== id.toString());
    } else {
      // add
      user.frinds.push(friendsId);
      friend.frinds.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.frinds.map(fid => User.findById(fid))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addRemoveBookmark = async (req, res) => {
  try {
    const {id, postId} = req.params;

    const user = await User.findById(id);
    // if user not found
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const post = await Post.findById(postId);
    // if post not found
    if (!post){
      return res.status(404).json({ message: "post not found" });
    }
    // toggle bookmark
    if (user.bookmarks.includes(post._id)) {
      user.bookmarks = user.bookmarks.filter(
        (bookmakId) => bookmakId.toString() !== post._id.toString()
      )
    } else {
      user.bookmarks.push(post._id)
    }

    await user.save();

    return res.status(200).json(user.bookmarks)

  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookmarks = async (req, res) => {
    try {
      const {id} = req.params
      const user = await User.findById(id);
      const bookmarks = await Promise.all(
          user.bookmarks.map((id)=> Post.findById(id))
      );

      res.status(200).json(bookmarks)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
};

