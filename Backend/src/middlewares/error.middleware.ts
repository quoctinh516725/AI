import { Request, Response, NextFunction } from "express";
import { env } from "../configs/env";
import { sendError } from "../utils/response";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (env.NODE_ENV === "production") {
    if (err.isOperational) {
      sendError(res, err.message, err.statusCode);
    } else {
      console.log("Lỗi hệ thống: ", err);
      sendError(res, "Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  } else {
    //Development
    sendError(res, err.message, err.statusCode, err.stack);
  }
}
