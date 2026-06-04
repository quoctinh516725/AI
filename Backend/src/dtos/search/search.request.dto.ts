import { ValidationError } from "../../error/AppError";

export type SearchRequestDto = {
  image_base64: string;
  name?: string;
  age?: number;
  gender?: string;
  location?: string;
  hometown?: string;
  lost_year?: number;
  date_of_birth?: Date;
};

export const validateSearchRequest = (data: any): SearchRequestDto => {
  const errors: string[] = [];

  if (!data.image_base64 || data.image_base64.trim().length === 0) {
    errors.push("Vui lòng cung cấp hình ảnh để tìm kiếm");
  }

  let age: number | undefined = undefined;
  if (data.age !== undefined && data.age !== null && data.age !== "") {
    age = Number(data.age);
    if (isNaN(age) || age <= 0) {
      errors.push("Tuổi phải là số lớn hơn 0");
    }
  }

  const gender = data.gender?.toLowerCase();
  if (gender !== undefined && !["male", "female"].includes(gender)) {
    errors.push("Vui lòng chọn giới tính hợp lệ (male, female)");
  }

  let date_of_birth: Date | undefined = undefined;
  if (data.date_of_birth) {
    const d = new Date(data.date_of_birth);
    if (isNaN(d.getTime())) {
      errors.push("Ngày sinh không hợp lệ");
    } else {
      date_of_birth = d;
    }
  }

  let lost_year: number | undefined = undefined;
  if (data.lost_year) {
    lost_year = Number(data.lost_year);
    if (
      isNaN(lost_year) ||
      lost_year < 1900 ||
      lost_year > new Date().getFullYear()
    ) {
      errors.push("Năm mất tích không hợp lệ");
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }

  return {
    image_base64: data.image_base64.trim(),
    name: data.name?.trim(),
    age: age,
    gender: gender,
    location: data.location?.trim(),
    hometown: data.hometown?.trim(),
    lost_year: lost_year,
    date_of_birth: date_of_birth,
  };
};

