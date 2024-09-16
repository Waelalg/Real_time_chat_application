import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import authRoutes from '../backend/routes/authRoutes.js';
import messageRoutes from '../backend/routes/messageRoutes.js';
import usersRoutes from '../backend/routes/usersRoutes.js';
import connectDB from './db/connectToMongoDb.js';
import { app,server } from './socket/socket.js';

dotenv.config();


const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);
app.use("/api/users" , usersRoutes);

server.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on ${PORT}`)
});
