import { Router } from "express";
import searchController from "../controllers/search.controller";
import { upload } from "../configs/multer";

const router = Router();

// Public read route for searching
router.post("/", upload.single("image"), searchController.searchPersons);

export default router;
