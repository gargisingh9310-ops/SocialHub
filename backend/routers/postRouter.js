import { Router } from "express"
import { createPost, getFeed, likePost, commentPost, deletePost, getPostLikes } from "../controllers/postController.js"

const postRouter = Router()

postRouter.post("/create", createPost)
postRouter.get("/feed/:userId", getFeed)
postRouter.post("/like", likePost)
postRouter.post("/comment", commentPost)
postRouter.post("/delete", deletePost)
postRouter.get("/likes/:postId", getPostLikes)

export default postRouter