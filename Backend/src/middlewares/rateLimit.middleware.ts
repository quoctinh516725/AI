import { NextFunction, Request, Response } from "express";
import { LimitError } from "../error/AppError";
import { checkRateLimit } from "../utils/rateLimit";

type RateLimit = { prefix: string; limit: number; windowSeconds: number };

export const rateLimit =
  ({ prefix, limit, windowSeconds }: RateLimit) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers["x-forwarded-for"];
    const key = `rate:${prefix}:${ip}`;

    const isAllowed = await checkRateLimit({ key, limit, windowSeconds });

    if (!isAllowed)
      throw new LimitError("Quá nhiều yêu cầu. Vui lòng thử lại sau!");

    next();
  };
