import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import userService from "../services/user.service";
import { sendSuccess } from "../utils/response";

class UserController {
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { username, phone, password } = req.body;
    let avatar = undefined;

    if (req.file) {
      avatar = (req.file as any).path; // Lấy URL ảnh từ Cloudinary/Multer
    }

    const updatedUser = await userService.updateProfile(userId, {
      username,
      phone,
      password,
      avatar,
    });

    return sendSuccess(res, updatedUser, "Cập nhật hồ sơ thành công!");
  });
}

export default new UserController();
