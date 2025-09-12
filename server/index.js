import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {verifyToken} from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js";
import upload from "./middleware/multer.js";



// Configurations: middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
// app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // ✅ allow images to be loaded cross-origin
  })
);
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// app.use(cors());
app.use("/assets",express.static(path.join(__dirname, "public/assets")));

app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://mawja.vercel.app" // ✅ your deployed frontend
  ],
  credentials: true
}));

// Routes with files
app.post("/auth/register", upload.single("image"), register);
app.post("/posts", verifyToken, upload.single("image"), createPost)

//routes
app.use("/auth", authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);



//mongoose setup
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
).then(()=>{
    app.listen(PORT, ()=> console.log(`server port: / ${PORT} 🟢`));

    // ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=> console.log(`${error} did not connect 🔴`))