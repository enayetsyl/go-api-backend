import express from "express";
import { signup } from "../controllers/signupControllers.js";

const router = express.Router();

router.post("/", signup);

export default router;
