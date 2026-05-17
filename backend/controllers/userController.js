 import bcrypt from "bcrypt"
  import otpgenerator from "otp-generator"
 import userModel from "../schemas/userSchemas.js"
 import { sendOTP } from "../services/otpservice.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

// REGISTER CONTROLLER

export async function register(req,res){

  const {email,password,userName,lastName,firstName} = req.body

  if(!email || !password || !firstName || !userName){

    return res.status(400).json({
      message:"incomplete information, please fill in all details"
    })
  }

  try {

    // CHECK EXISTING USER
    let alreadyExists = await userModel.findOne({
      $or:[{email}, {userName}]
    })

    if(alreadyExists){

      return res.status(400).json({
        message:"your email is already in use!!"
      })
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password,10)

    // GENERATE OTP
    const otp = otpgenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    // CREATE USER
    const user = new userModel({
      email,
      password: hashedPassword,
      userName,
      lastName,
      firstName,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false
    })

    await user.save()

    // SEND OTP
    const otpResponse = await sendOTP(email, otp)

    console.log("OTP RESPONSE:", otpResponse)

    // OTP FAILED
    if (!otpResponse.success) {

      return res.status(500).json({
        message:"OTP sending failed"
      })
    }

    // SUCCESS
    return res.status(201).json({
      message:"otp sent successfully",
      userId: user._id,
      email: user.email
    })

  } catch (error) {

    console.log("REGISTER ERROR:", error)

    return res.status(500).json({
      message:"registration failed"
    })
  }
}

export async function verifyOtp(req,res){
try {
  const {userId, otp} = req.body

  if(!userId || !otp){
    return res.status(400).json({
      message:"either otp is missing or userid "
    })
  }

  const user= await userModel.findById(userId)

if(!user){
  return res.status(400).json({
    message:"user not found"
  })
}
if(new Date()> user.otpExpires ){
return res.status(400).json({
  message:"otp expired"
})
}
if(otp== user.otp){
  user.isVerified= true
  user.otp= null
  user.otpExpires= null
  await user.save()

  const token=  jwt.sign(
    {userId: user._id, userName: user.userName, email : user.email},
process.env.SECRET_KEY, {expiresIn:"7d"}
   )
 res.status(200)
  .cookie('token', token, {
    httpOnly: true,
    secure: true,
     sameSite: 'none'
  })
  .json({
    message: "verified",
    userId: user._id,
    userName: user.userName,
    isLoggedIn: true
  })
}
else{
  return res.status(400).json({
    message:"otp incorrect"
  })
}
} catch (error) {
  return res.status(500).json({
    message:"we are currently exp any issue "
  })
}
 }

 export async function resendOtp(req, res) {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        message: "userId required"
      })
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    const otp = otpgenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    user.otp = otp
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await user.save()

    await sendOTP(user.email, otp)

    return res.status(200).json({
      message: "OTP resent successfully"
    })

  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

 export async function updateProfile(req, res) {
  try {
    const { userId, bio, profilePicture } = req.body

    if (!userId) {
      return res.status(400).json({
        message: "userId required"
      })
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    if (bio) user.bio = bio
    if (profilePicture) user.profilePicture = profilePicture

    await user.save()

    return res.status(200).json({
      message: "profile updated",
      bio: user.bio,
      profilePicture: user.profilePicture
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function getProfile(req, res) {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        message: "userId required"
      })
    }

    const user = await userModel.findOne({_id:userId})

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function searchFriends(req, res) {
  try {
    const { query, userId } = req.query

    if (!query) {
      return res.status(400).json({
        message: "search query required"
      })
    }

    const users = await userModel.find({
      $or: [
        { userName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('_id userName firstName lastName email profilePicture')

    const filteredUsers = users.filter(user => user._id.toString() !== userId)

    return res.status(200).json({
      users: filteredUsers
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function addFriend(req, res) {
  try {
    const { userId, friendId } = req.body

    if (!userId || !friendId) {
      return res.status(400).json({
        message: "userId and friendId required"
      })
    }

    const user = await userModel.findById(userId)
    const friend = await userModel.findById(friendId)

    if (!user || !friend) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        message: "already friends"
      })
    }

    user.friends.push(friendId)
    friend.friends.push(userId)

    await user.save()
    await friend.save()

    return res.status(200).json({
      message: "friend added successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function removeFriend(req, res) {
  try {
    const { userId, friendId } = req.body

    if (!userId || !friendId) {
      return res.status(400).json({
        message: "userId and friendId required"
      })
    }

    const user = await userModel.findById(userId)
    const friend = await userModel.findById(friendId)

    if (!user || !friend) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId)
    friend.friends = friend.friends.filter(id => id.toString() !== userId)

    await user.save()
    await friend.save()

    return res.status(200).json({
      message: "friend removed successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function getFriends(req, res) {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        message: "userId required"
      })
    }

    const user = await userModel.findById(userId).populate('friends', '_id userName firstName lastName email profilePicture')

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    return res.status(200).json({
      friends: user.friends
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function followUser(req, res) {
  try {
    const { userId, followId } = req.body

    if (!userId || !followId) {
      return res.status(400).json({
        message: "userId and followId required"
      })
    }

    const user = await userModel.findById(userId)
    const followUser = await userModel.findById(followId)

    if (!user || !followUser) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    if (!user.following) user.following = []
    if (!followUser.followers) followUser.followers = []

    if (user.following.includes(followId)) {
      return res.status(400).json({
        message: "already following"
      })
    }

    user.following.push(followId)
    followUser.followers.push(userId)

    await user.save()
    await followUser.save()

    return res.status(200).json({
      message: "user followed"
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function unfollowUser(req, res) {
  try {
    const { userId, followId } = req.body

    if (!userId || !followId) {
      return res.status(400).json({
        message: "userId and followId required"
      })
    }

    const user = await userModel.findById(userId)
    const followUser = await userModel.findById(followId)

    if (!user || !followUser) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    if (!user.following) user.following = []
    if (!followUser.followers) followUser.followers = []

    user.following = user.following.filter(id => id !== followId)
    followUser.followers = followUser.followers.filter(id => id !== userId)

    await user.save()
    await followUser.save()

    return res.status(200).json({
      message: "user unfollowed"
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function getStats(req, res) {
  try {
    const { userId } = req.params

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    return res.status(200).json({
      friends: user.friends?.length || 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function login(req, res) {
   try {
     const { userName, password } = req.body

     if (!userName || !password) {
       return res.status(400).json({
         message: "username or password is missing"
       })
     }

     const user = await userModel.findOne({ userName: userName })

     if (!user) {
       return res.status(400).json({
         message: "user not found"
       })
     }

     if (!user.isVerified) {
       return res.status(403).json({
         message: "please verify your email first"
       })
     }

     const isPasswordValid = await bcrypt.compare(password, user.password)

     if (!isPasswordValid) {
       return res.status(400).json({
         message: "invalid credentials"
       })
     }

     const token = jwt.sign(
       { userId: user._id, userName: user.userName, email: user.email },
       process.env.SECRET_KEY,
       { expiresIn: "7d" }
     )

     return res.status(200)
       .cookie('token', token, { 
         httpOnly: true,
         secure: true,
         sameSite: 'none'
       })
       .json({
         message: "login successful",
         token: token,
         userId: user._id,
         userName: user.userName,
         isLoggedIn: true
       })
   } catch (error) {
     return res.status(500).json({
       message: "something went wrong"
     })
   }
 }