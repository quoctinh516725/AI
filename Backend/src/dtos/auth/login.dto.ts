import { ValidationError } from "../../error/AppError";
import AuthValidation from "../../validations/auth.validation";

export interface LoginRequestDto {
  emailOrUsername: string;
  password: string;
}

export interface UserInfoDto {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  status: string;
}

export interface LoginResponseDto {
  user: UserInfoDto;
  accessToken: string;
  refreshToken: string;
}

export const loginRequestDto = (data: any): LoginRequestDto => {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Dữ liệu không hợp lệ!");
  }
  const { emailOrUsername, password } = data;
  const errors: string[] = [];
  if (!emailOrUsername) {
    errors.push("Vui lòng nhập email hoặc username!");
  }

  if (!password || !AuthValidation.isValidPassword(password)) {
    errors.push("Password bị thiếu hoặc ít hơn 6 ký tự!");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
  return {
    emailOrUsername,
    password,
  };
};
