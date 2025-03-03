import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/connectDb.js';
import authRouter from './routes/auth-route.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});

app.use('/api/auth', authRouter);
