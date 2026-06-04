import redis from "../configs/redis";

type CheckRateLimit = { key: string; limit: number; windowSeconds: number };

export const checkRateLimit = async ({
  key,
  limit,
  windowSeconds,
}: CheckRateLimit): Promise<boolean> => {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const multi = redis.multi();

  // Xóa request cũ
  multi.zremrangebyscore(key, 0, windowStart);

  // Đếm request
  multi.zcard(key);

  multi.zadd(key, now, now.toString());
  multi.expire(key, windowSeconds);
  // Exec transaction để lấy dự liệu count
  const result = await multi.exec();
  const count = result?.[1][1] as number;

  return count < limit;
};
