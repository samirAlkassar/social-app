import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            required: true,
        },
        firstName: {
            type:String,
            required: true,
        },
        lastName: {
            type:String,
            required: true,
        },
        locaation: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        postBackgroundMode: {
        type: Number,
            min: 0,     // lowest allowed mode
            max: 8,     // highest allowed mode
            default: 0, // start with white
        },
        likes: {
            type: Map,
            of: Boolean,
            default:{}
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
    },
    {timestamps: true}
);

const Post = mongoose.model("Post", PostSchema);
export default Post;