import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from "./services/dbServices.js";
// import {  loginRouter, protectedRouter } from "./routes/index.js";

import signupRouter from "./routes/signupRouter.js"
import loginRouter from "./routes/loginRouter.js"
import protectedRouter from "./routes/protectedRouter.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth/signup", signupRouter);
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/protected", protectedRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
