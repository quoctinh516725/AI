import { Router } from "express";
import searchController from "../controllers/search.controller";
import { upload } from "../configs/multer";
import { performance } from "perf_hooks";

const router = Router();

// Public read route for searching
router.post(
  "/",
  (req, _res, next) => {
    (req as any)._searchRequestStartTime = performance.now();
    (req as any)._multerSearchStartTime = performance.now();
    next();
  },
  upload.single("image"),
  (req, _res, next) => {
    const endMulter = performance.now();
    const duration = endMulter - ((req as any)._multerSearchStartTime || endMulter);
    console.log(`[Timer] [Route] [Search] Multer Image Parsing took: ${duration.toFixed(2)}ms`);
    next();
  },
  searchController.searchPersons
);

export default router;

