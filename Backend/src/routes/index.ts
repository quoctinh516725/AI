import { Router } from "express";
import authRoutes from "./auth.route";
import postRoutes from "./post.route";
import searchRoutes from "./search.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/search", searchRoutes);

export default router;
