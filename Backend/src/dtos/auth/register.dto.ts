import { ValidationError } from "../../error/AppError";
import AuthValidation from "../../validations/auth.validation";
import { UserInfoDto } from "./login.dto";

export interface RegisterRequestDto {
  email: string;
  username: string;
  password: string;
  phone: string;
}

export interface RegisterResponseDto {
  user: UserInfoDto;
  accessToken: string;
  refreshToken: string;
}

export const registerRequestDto = (
  data: RegisterRequestDto,
): RegisterRequestDto => {
  const { email, username, password, phone } = data;
  const errors: string[] = [];
  if (!email || !AuthValidation.isValidEmail(email)) {
    errors.push("Email bị thiếu hoặc không hợp lệ!");
  }
  if (!password || !AuthValidation.isValidPassword(password)) {
    errors.push("Password bị thiếu hoặc ít hơn 6 ký tự!");
  }
  if (!username || !AuthValidation.isValidUsername(username)) {
    errors.push("Username bị thiếu hoặc không hợp lệ!");
  }
  if (!phone || !AuthValidation.isValidPhone(phone)) {
    errors.push("Phone bị thiếu hoặc không hợp lệ!");
  }
  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
  return {
    email,
    password,
    username,
    phone,
  };
};
