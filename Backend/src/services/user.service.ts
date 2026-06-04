import userRepository from "../repositories/user.repository";
import { NotFoundError, BadRequestError } from "../error/AppError";
import bcrypt from "bcrypt";

class UserService {
  async updateProfile(
    userId: string, 
    data: { username?: string; phone?: string; password?: string; avatar?: string }
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng!");
    }

    const updateData: any = {};

    if (data.username && data.username !== user.username) {
      const existingUser = await userRepository.findByUsername(data.username);
      if (existingUser) {
        throw new BadRequestError("Tên người dùng đã tồn tại!");
      }
      updateData.username = data.username;
    }

    if (data.phone) {
      updateData.phone = data.phone;
    }
    
    if (data.avatar) {
      updateData.avatar = data.avatar;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await userRepository.update(userId, updateData);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

export default new UserService();
