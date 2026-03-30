//nodemailer

import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transportService= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    }

})

export async function sendOTP(email, otp) {
    try{
        const mailOptions= {
            from: process.env.GMAIL_USER,
            to:email, 
            subject: "EMAIL VERIFICATION",
            html: `
            <div>
            <p> The OTP to register is-: <b>${otp}</b></p>
            <p>If you haven't asked for otp , kindly ignore this mail.</p> 
            </div>
            `
        }
        await transportService.sendMail(mailOptions)

        return {success: true, message:"OTP sent"}
    } catch(error){
        return {success: false, message:"OTP failled"}
    }
}

export async function verifyTransport() {
    try{ 
await transportService.verify()
console.log("transport verified");
 
    } catch(e){
console.log("transport verification failed", e); 

    }
    
}   