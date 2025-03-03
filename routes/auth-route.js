import express from 'express';
import { signIn, signUp, logout } from '../controllers/auth-controller.js';

const authRouter = express.Router();

// sign-up route
authRouter.post('/sign-up', signUp);

// sign-in route
authRouter.post('/sign-in', signIn);

// log-out route
authRouter.post('/log-out', logout);

// veryfy-email route
// router.post('/verify-email', verifyEmail);

// forgot-password route
// router.post('/forgot-password', forgotPassword);

// reset-password route
// router.post('/reset-password/:token', resetPassword);

export default authRouter;
