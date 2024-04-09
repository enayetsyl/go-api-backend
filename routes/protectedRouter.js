import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { protectedRoute } from "../controllers/protectedRouteController.js";

// Create a new router for protected routes
const protectedRouter = express.Router();

// Apply the authenticateToken middleware to all routes in the protected router
protectedRouter.use(authenticateToken);

// Define the protected route within the protected router
protectedRouter.get("/", protectedRoute);

export default protectedRouter;
