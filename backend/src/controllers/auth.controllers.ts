import { Request, Response } from "express";
import sendEmailFn from "../utils/sendEmailFn";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { userSignupValidator } from "../validators";
const JWT_SECRET = process.env.JWT_SECRET_KEY as string; // Use env variable

export const signupAuthController = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validationResult = userSignupValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Validation error", errors: validationResult.error.errors });
        }

        const { name, email, phone } = validationResult.data;

        // Check if user already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const phoneExists = await User.findOne({ phone }); // Use findOne instead of find
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save user to database
        User.create({ name, email, phone, otp })
            .then(async () => {
                // Send OTP email
                await sendEmailFn({
                    email,
                    subject: "Your Verification Code",
                    msg: `<p>Your OTP is: <strong>${otp}</strong></p>`
                });

                // Send response after email is sent
                return res.status(201).json({
                    message: "User signed up successfully. OTP sent to email.",
                    user: { name, email, phone },
                });
            })
            .catch((error) => {
                console.error("Error creating user:", error);
                return res.status(500).json({ message: "Internal Server Error" });
            });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        // Find user by phone number
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP matches
        if (user.otp !== Number(otp)) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // OTP is correct, mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Remove OTP after verification
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, phone: user.phone },
            JWT_SECRET,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        return res.status(200).json({
            message: "OTP verified successfully. Login successful.",
            token,
            user: { name: user.name, email: user.email, phone: user.phone },
        });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const sendOtpController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a new 6-digit OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Update OTP in database
        user.otp = Number(newOtp);
        await user.save();

        // Send OTP email
        await sendEmailFn({
            email,
            subject: "Your Verification Code",
            msg: `<p>Your OTP is: <strong>${newOtp}</strong></p>`
        });

        return res.status(200).json({ message: "OTP sent to email." });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



