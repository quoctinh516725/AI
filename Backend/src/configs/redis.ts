import Redis from "ioredis";
import { env } from "./env";

const redis = new Redis(env.REDIS_URL as string, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis connected...");
});

redis.on("error", (e) => {
  console.log("Redis connect error: ", e);
});

export default redis;