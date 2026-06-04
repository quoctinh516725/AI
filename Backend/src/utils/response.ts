import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  stack?: string;
}

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  stack?: string,
) => {
  const errorResponse: ApiResponse<null> = {
    success: false,
    message,
  };

  if (stack) {
    errorResponse.stack = stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };

  return res.status(statusCode).json(response);
};
