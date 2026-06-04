import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import authService from "../services/auth.service";
import { loginRequestDto, registerRequestDto } from "../dtos/auth";
import { sendSuccess } from "../utils/response";
import { setRefreshTokenCookie } from "../utils/cookie";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password, phone } = registerRequestDto(req.body);

    const result = await authService.register(email, username, password, phone);
    const { refreshToken, ...userData } = result;

    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(res, userData, "Đăng ký thành công!");
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { emailOrUsername, password } = loginRequestDto(req.body);

    const result = await authService.login(emailOrUsername, password);

    const { refreshToken, ...userData } = result;
    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(res, userData, "Đăng nhập thành công!");
  });
}

export default new AuthController();
