import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String
    },

    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    otp: {
      type: String
    },

    otpExpires: {
      type: Date
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500
    },

    profilePicture: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg"
    },

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users"
      }
    ],

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users"
      }
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users"
      }
    ],

    profileViews: {
      type: Number,
      default: 0
    },

    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const userModel = model("Users", userSchema);

export default userModel;