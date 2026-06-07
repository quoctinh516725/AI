import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../error/AppError";
import { verifyAccessToken, DecodedToken } from "../utils/jwt";
import userRepository from "../repositories/user.repository";
import { performance } from "perf_hooks";

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
    const startAuth = performance.now();
    const authHeaders = req.headers.authorization;

    const token = authHeaders?.startsWith("Bearer ")
      ? authHeaders.split(" ")[1]
      : undefined;

    if (!token) {
      throw new UnauthorizedError("Vui lòng đăng nhập để thực hiện tác vụ!");
    }

    const startJwt = performance.now();
    const decoded = verifyAccessToken(token);
    const endJwt = performance.now();
    console.log(`[Timer] [Auth] JWT Verification took: ${(endJwt - startJwt).toFixed(2)}ms`);

    // Check if user exists and is active
    const startUserLookup = performance.now();
    const user = await userRepository.findById(decoded.userId);
    const endUserLookup = performance.now();
    console.log(`[Timer] [Auth] DB User Lookup took: ${(endUserLookup - startUserLookup).toFixed(2)}ms`);

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedError("Tài khoản không hợp lệ!");
    }

    req.user = decoded;
    const endAuth = performance.now();
    console.log(`[Timer] [Auth] Total Authenticate Middleware took: ${(endAuth - startAuth).toFixed(2)}ms`);
    next();
  },
);

