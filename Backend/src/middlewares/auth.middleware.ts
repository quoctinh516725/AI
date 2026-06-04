import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../error/AppError";
import { verifyAccessToken, DecodedToken } from "../utils/jwt";
import userRepository from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeaders = req.headers.authorization;

    const token = authHeaders?.startsWith("Bearer ")
      ? authHeaders.split(" ")[1]
      : undefined;

    if (!token) {
      throw new UnauthorizedError("Vui lòng đăng nhập để thực hiện tác vụ!");
    }

    const decoded = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await userRepository.findById(decoded.userId);
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedError("Tài khoản không hợp lệ!");
    }

    req.user = decoded;
    next();
  },
);
