import dotenv from "dotenv";
dotenv.config();

function required(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Thiếu biến môi trường ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  PORT: required("PORT"),
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: required("JWT_ACCESS_EXPIRES_IN"),
  JWT_REFRESH_EXPIRES_IN: required("JWT_REFRESH_EXPIRES_IN"),
  NODE_ENV: required("NODE_ENV"),
  REDIS_URL: required("REDIS_URL"),
  FRONTEND_URL: required("FRONTEND_URL"),
  AI_URL: required("AI_URL"),
};
