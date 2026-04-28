import userModel from "../schemas/userSchemas.js";
import messageModel from "../schemas/messageSchema.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    // user fetch
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ counts
    const friendsCount = user.friends.length;
    const profileViews = user.profileViews;

    const messagesCount = await messageModel.countDocuments({
      receiverId: userId
    });

    res.status(200).json({
      success: true,
      data: {
        friendsCount,
        profileViews,
        messagesCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};