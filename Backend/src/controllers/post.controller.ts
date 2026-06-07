import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ValidationError } from "../error/AppError";
import { sendSuccess } from "../utils/response";
import postService from "../services/post.service";
import { validateCreatePostRequest } from "../dtos/post";
import { uploadStream } from "../utils/uploadStream";
import { performance } from "perf_hooks";

class PostController {
  createPost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const startController = performance.now();
      const userId = req.user?.userId!;
      const file = req.file;

      if (!file) {
        throw new ValidationError("Vui lòng tải lên một hình ảnh");
      }

      const startValidationAndBase64 = performance.now();
      const data = validateCreatePostRequest(req.body);
      const fileBufferBase64 = file.buffer.toString("base64");
      const endValidationAndBase64 = performance.now();
      console.log(`[Timer] [Controller] Payload validation & base64 conversion took: ${(endValidationAndBase64 - startValidationAndBase64).toFixed(2)}ms`);

      const startServiceCall = performance.now();
      const createdPost = await postService.createPost(userId, {
        ...data,
        image_base64: fileBufferBase64,
        image_url: null, // Sẽ được update sau bằng worker
      });
      const endServiceCall = performance.now();
      console.log(`[Timer] [Controller] postService.createPost call took: ${(endServiceCall - startServiceCall).toFixed(2)}ms`);

      // Thêm job vào queue để upload ảnh
      const startQueueAdd = performance.now();
      const { imageUploadQueue } = await import("../configs/queue");
      await imageUploadQueue.add("upload-image", {
        postId: createdPost.id,
        userId: userId,
        fileBufferBase64: fileBufferBase64,
        originalName: file.originalname,
        mimetype: file.mimetype,
      });
      const endQueueAdd = performance.now();
      console.log(`[Timer] [Controller] Adding upload job to BullMQ took: ${(endQueueAdd - startQueueAdd).toFixed(2)}ms`);

      const endController = performance.now();
      console.log(`[Timer] [Controller] Total PostController.createPost action took: ${(endController - startController).toFixed(2)}ms`);

      const overallStartTime = (req as any)._createPostRequestStartTime;
      if (overallStartTime) {
        console.log(`[Timer] [E2E] Total E2E Request processing (including Multer + Controller) took: ${(performance.now() - overallStartTime).toFixed(2)}ms`);
      }

      sendSuccess(res, createdPost, "Tạo bài đăng thành công");
    },
  );


  updatePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId!;
      const postId = req.params.id;
      if (!postId) {
        throw new ValidationError("Vui lòng cung cấp ID của bài đăng");
      }

      const data = req.body;
      const updatedPost = await postService.updatePost(
        postId as string,
        data,
        userId,
      );
      sendSuccess(res, updatedPost, "Cập nhật bài đăng thành công");
    },
  );

  deletePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId!;

      const postId = req.params.id;
      if (!postId) {
        throw new ValidationError("Vui lòng cung cấp ID của bài đăng");
      }

      await postService.deletePost(postId as string, userId);
      sendSuccess(res, null, "Xóa bài đăng thành công");
    },
  );

  getPostById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const postId = req.params.id;
      if (!postId) {
        throw new ValidationError("Vui lòng cung cấp ID của bài đăng");
      }

      const post = await postService.getPostById(postId as string);
      sendSuccess(res, post, "Lấy bài đăng thành công");
    },
  );

  getPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page, limit } = req.pagination!;
      const posts = await postService.getPosts(page, limit);
      sendSuccess(res, posts, "Lấy danh sách bài đăng thành công");
    },
  );

  getMyPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId!;
      const { page, limit } = req.pagination!;
      const posts = await postService.getMyPosts(userId, page, limit);
      sendSuccess(res, posts, "Lấy danh sách bài đăng của tôi thành công");
    },
  );

  confirmPost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId!;
      const postId = req.params.id;
      if (!postId) {
        throw new ValidationError("Vui lòng cung cấp ID của bài đăng");
      }

      const result = await postService.confirmPost(
        postId as string,
        userId,
        req.body,
      );
      sendSuccess(res, result, "Xác nhận bài đăng thành công");
    },
  );

  getSimilarPersons = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId!;
      const postId = req.params.id as string;
      if (!postId) {
        throw new ValidationError("Vui lòng cung cấp ID của bài đăng");
      }

      const result = await postService.getSimilarPersons(postId, userId);
      sendSuccess(res, result, "Lấy danh sách người giống thành công");
    },
  );
}

export default new PostController();
