import { Queue } from "bullmq";
import { env } from "./env";
import IORedis from "ioredis";

// Cấu hình Redis Connection cho BullMQ
export const connection = new IORedis(env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const imageUploadQueue = new Queue("image-upload-queue", { connection });
