import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isUserExit = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (isUserExit) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new UserModel({
            email,
            password: hashedPassword,
            username,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        const savedUser = await newUser.save();
        generateTokenAndSetCookie(res, res._id);

        // send verification email
        // await sendVerificationEmail(savedUser.email, savedUser.name, verificationToken);

        const { password: pass, ...rest } = savedUser._doc;
        res.status(201).json({
            suscess: true,
            message: 'User created successfully!',
            user: rest,
        });
    } catch (error) {
        console.log('Error in signUp controller:', error);
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email!' });
        }
        const passwordValid = await bcryptjs.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        generateTokenAndSetCookie(res, user._id);
        const { password: pass, ...rest } = user._doc;
        res.status(200).json({
            success: true,
            message: 'User signed in successfully!',
            user: rest,
        });
    } catch (error) {
        console.log('Error in signIn controller:', error);
    }
};

export const logout = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'User not logged in!' });
    } else {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully!' });
    }
};
// export const verifyEmail = async (req, res) => {};
// export const forgotPassword = async (req, res) => {};
// export const resetPassword = async (req, res) => {};
