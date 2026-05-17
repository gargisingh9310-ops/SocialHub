import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transportService = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

// SEND OTP
export async function sendOTP(email, otp) {

  try {

    const mailOptions = {

      from: process.env.GMAIL_USER,

      to: email,

      subject: "SocialHub OTP Verification",

      html: `
        <div style="font-family: Arial; padding:20px;">

          <h2>SocialHub Verification</h2>

          <p>Your OTP is:</p>

          <h1 style="letter-spacing:5px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in 10 minutes.
          </p>

        </div>
      `
    }

    const info = await transportService.sendMail(mailOptions)

    console.log("MAIL SENT:", info.response)

    return {
      success: true
    }

  } catch (error) {

    console.log("OTP ERROR:", error)

    return {
      success: false
    }
  }
}

// VERIFY TRANSPORT
export async function verifyTransport() {

  try {

    await transportService.verify()

    console.log("✓ Transport verified successfully")

  } catch (error) {

    console.log("✗ Transport verification failed")

    console.log(error)
  }
}