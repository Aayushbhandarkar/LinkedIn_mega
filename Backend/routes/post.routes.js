import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { comment, createPost, getPost, like, deletePost } from "../controllers/post.controllers.js";

const postRouter = express.Router();

// Create post
postRouter.post("/create", isAuth, upload.single("image"), createPost);

// Get all posts
postRouter.get("/getpost", isAuth, getPost);

// Like/Unlike post
postRouter.get("/like/:id", isAuth, like);

// Comment on post
postRouter.post("/comment/:id", isAuth, comment);

// Delete post
postRouter.delete("/delete/:id", isAuth, deletePost);

export default postRouter;
