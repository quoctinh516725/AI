import { Worker, Job } from "bullmq";
import { connection } from "../configs/queue";
import { uploadStream } from "../utils/uploadStream";
import postRepository from "../repositories/post.repository";
import { env } from "../configs/env";

export const startImageUploadWorker = () => {
  const worker = new Worker(
    "image-upload-queue",
    async (job: Job) => {
      const { postId, userId, fileBufferBase64, originalName, mimetype } = job.data;

      console.log(`[Worker] Bắt đầu upload ảnh cho Post ID: ${postId}`);

      try {
        // Giải mã base64 thành buffer
        const buffer = Buffer.from(fileBufferBase64, "base64");
        const file = {
          buffer,
          originalname: originalName,
          mimetype: mimetype,
        } as Express.Multer.File;

        // Tiến hành upload lên Cloudinary
        const result: any = await uploadStream(file, {
          folder: `beacons/posts/${userId}/images`,
          publicId: `post_${Date.now()}_${Math.random()}`,
          overwrite: false,
        });

        if (!result || !result.secure_url) {
          throw new Error("Không nhận được URL từ Cloudinary");
        }

        console.log(`[Worker] Upload thành công, URL: ${result.secure_url}`);

        // Cập nhật lại vào database
        await postRepository.update(postId, { image_url: result.secure_url });
        console.log(`[Worker] Đã cập nhật image_url cho Post ID: ${postId}`);
      } catch (error) {
        console.error(`[Worker] Lỗi khi upload ảnh cho Post ID ${postId}:`, error);
        throw error;
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} hoàn thành.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} thất bại:`, err);
  });

  return worker;
};
