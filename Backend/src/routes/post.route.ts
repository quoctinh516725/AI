import { Router } from "express";
import postController from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validatePagination } from "../validations/public.validation";
import { upload } from "../configs/multer";
import { performance } from "perf_hooks";

const router = Router();

// Public read routes
router.get("/", validatePagination, postController.getPosts);

// Authenticated route for "me" MUST be before /:id to avoid matching "me" as an id
router.get("/me", authenticate, validatePagination, postController.getMyPosts);

// Public read route (single post)
router.get("/:id", postController.getPostById);

// Authenticated write routes
router.use(authenticate); 
router.post(
  "/",
  (req, _res, next) => {
    (req as any)._createPostRequestStartTime = performance.now();
    (req as any)._multerStartTime = performance.now();
    next();
  },
  upload.single("image"),
  (req, _res, next) => {
    const endMulter = performance.now();
    const duration = endMulter - ((req as any)._multerStartTime || endMulter);
    console.log(`[Timer] [Route] Multer Image Parsing took: ${duration.toFixed(2)}ms`);
    next();
  },
  postController.createPost
);
router.patch("/:id/confirm", postController.confirmPost);
router.get("/:id/similar", postController.getSimilarPersons);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);


export default router;
