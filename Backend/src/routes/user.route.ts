import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../configs/multer";

const router = Router();

// Require authentication for all user routes
router.use(authenticate);

// Update user profile
router.put("/profile", upload.single("avatar"), userController.updateProfile);

export default router;
