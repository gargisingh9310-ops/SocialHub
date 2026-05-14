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

export async function sendOTP(email, otp) {
  try {

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "EMAIL VERIFICATION OTP",
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

          <p>
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `
    }

    await transportService.sendMail(mailOptions)

    return {
      success: true,
      message: "OTP sent successfully"
    }

  } catch (error) {

    console.log("OTP ERROR:", error)

    return {
      success: false,
      message: "Failed to send OTP"
    }
  }
}

export async function verifyTransport() {

  try {

    await transportService.verify()

    console.log("✓ Transport verified successfully")

  } catch (error) {

    console.log("✗ Transport verification failed")

    console.log(error)
  }
}