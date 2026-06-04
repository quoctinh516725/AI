import { Response } from "express";
import { env } from "../configs/env";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  const isProduction = env.NODE_ENV === "production";
  const maxAge = parseInt(env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000;
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true, // Không cho JS đọc
    secure: isProduction, // Chỉ gửi qua HTTPS
    sameSite: "strict", // Chống CSRF
    maxAge,
    path: "/api/auth", //Chỉ gửi cookie qua các route của api này
  });
};

export const clearRefreshToken = (res: Response): void => {
  const isProduction = env.NODE_ENV === "production";

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true, // Không cho JS đọc
    secure: isProduction, // Chỉ gửi qua HTTPS
    sameSite: "strict", // Chống CSRF
    path: "/api/auth", //Chỉ gửi cookie qua các route của api này
  });
};
