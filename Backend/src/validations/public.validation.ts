import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../error/AppError";

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pageRaw = req.query.page as string | undefined;
  const limitRaw = req.query.limit as string | undefined;

  const page = pageRaw ? Number(pageRaw) : 1;
  const limit = limitRaw ? Number(limitRaw) : 10;

  if (pageRaw && Number.isNaN(page)) {
    throw new ValidationError("Page phải là số");
  }
  if (limitRaw && Number.isNaN(limit)) {
    throw new ValidationError("Limit phải là số");
  }
  if (page !== undefined && page < 1) {
    throw new ValidationError("Trang phải lớn hơn 0");
  }
  if (limit !== undefined && (limit < 1 || limit > 100)) {
    throw new ValidationError("Giới hạn phải từ 1 đến 100");
  }

  req.pagination = { page, limit };

  next();
};
