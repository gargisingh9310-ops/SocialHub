import { Router } from "express";
import { login, register, verifyOtp, updateProfile, getProfile, searchFriends, addFriend, removeFriend, getFriends, followUser, unfollowUser, getStats, resendOtp } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post("/register", register)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/resend-otp", resendOtp)
userRouter.post("/login", login)
userRouter.post("/update-profile", updateProfile)
userRouter.get("/profile/:userId", getProfile)
userRouter.get("/search-friends", searchFriends)
userRouter.post("/add-friend", addFriend)
userRouter.post("/remove-friend", removeFriend)
userRouter.get("/friends/:userId", getFriends)
userRouter.post("/follow", followUser)
userRouter.post("/unfollow", unfollowUser)
userRouter.get("/stats/:userId", getStats)

export default userRouter