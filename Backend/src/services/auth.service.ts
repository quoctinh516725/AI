import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import userRepository from "../repositories/user.repository";
import { ConflictError, UnauthorizedError } from "../error/AppError";
import { UserInfoDto } from "../dtos/auth/login.dto";

export class AuthService {
  async register(
    email: string,
    username: string,
    password: string,
    phone: string,
  ): Promise<{
    user: UserInfoDto;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email đã được sử dụng");
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictError("Username đã được sử dụng");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      email,
      username,
      password: hashedPassword,
      phone,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        username: user.username || "",
        email: user.email,
        fullName: null,
        avatarUrl: null,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(
    emailOrUsername: string,
    password: string,
  ): Promise<{
    user: UserInfoDto;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user
    const user = await userRepository.findByEmailOrUsername(emailOrUsername);
    if (!user || !user.password) {
      throw new UnauthorizedError("Email/Username hoặc mật khẩu không đúng");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email/Username hoặc mật khẩu không đúng");
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        username: user.username || "",
        email: user.email,
        fullName: null,
        avatarUrl: null,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }
}

const authService = new AuthService();
export default authService;
