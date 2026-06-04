import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../configs/env";

export interface DecodedToken {
  userId: string;
  email: string;
  jti?: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: {
  userId: string;
  email: string;
}): string => {
  const jti = Math.random().toString(36).substring(2);
  return jwt.sign(
    { ...payload, jti },
    env.JWT_ACCESS_SECRET! as string,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions,
  );
};

export const generateRefreshToken = (payload: {
  userId: string;
  email: string;
}): string => {
  const jti = Math.random().toString(36).substring(2);
  return jwt.sign(
    { ...payload, jti },
    env.JWT_REFRESH_SECRET! as string,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions,
  );
};

export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET!) as DecodedToken;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as DecodedToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export const getTokenRemainingTime = (token: string): number => {
  const decoded = jwt.decode(token) as DecodedToken;
  if (!decoded || !decoded.exp) return 0;
  return decoded.exp * 1000 - Date.now();
};
