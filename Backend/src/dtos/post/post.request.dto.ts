import { PostStatus } from "../../constants/postStatus";
import { ValidationError } from "../../error/AppError";

export type CreatePostRequestDto = {
  title: string;
  age: number;
  name: string;
  gender: string;
  location: string;
  image_url?: string | null;
  image_base64?: string;
  description: string;
  createdAt: Date;

  personId?: string;
  date_of_birth?: Date;
  hometown?: string;
  lost_year?: number;
};

export type UpdatePostRequestDto = {
  title?: string;
  age?: number;
  name?: string;
  gender?: string;
  location?: string;
  status?: string;
  description?: string;
  date_of_birth?: Date;
  hometown?: string;
  lost_year?: number;
};

export const validateCreatePostRequest = (data: any): CreatePostRequestDto => {
  const errors: string[] = [];

  // === title ===
  if (!data.title || data.title.trim().length === 0) {
    errors.push("Vui lòng nhập tiêu đề");
  }

  // === name ===
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Vui lòng nhập tên người mất tích");
  }

  // === age ===
  let age: number | undefined = undefined;
  if (data.age === undefined || data.age === null || data.age === "") {
    errors.push("Vui lòng nhập tuổi hợp lệ");
  } else {
    age = Number(data.age);
    if (isNaN(age) || age <= 0) {
      errors.push("Tuổi phải là số lớn hơn 0");
    }
  }

  // === gender ===
  const gender = data.gender?.toLowerCase();
  if (!gender || !["male", "female"].includes(gender)) {
    errors.push("Vui lòng chọn giới tính hợp lệ");
  }

  // === location ===
  if (!data.location || data.location.trim().length === 0) {
    errors.push("Vui lòng cung cấp nơi ở hiện tại");
  }

  // === description ===
  if (!data.description || data.description.trim().length === 0) {
    errors.push("Vui lòng nhập mô tả chi tiết đặc điểm nhận dạng");
  }

  // === date_of_birth ===
  let date_of_birth: Date | undefined = undefined;
  if (data.date_of_birth) {
    const d = new Date(data.date_of_birth);
    if (isNaN(d.getTime())) {
      errors.push("Ngày sinh không hợp lệ");
    } else {
      date_of_birth = d;
    }
  }

  // === lost_year ===
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

  // === personId ===
  let personId: string | undefined = undefined;
  if (data.personId !== undefined) {
    if (data.personId.trim().length === 0) {
      errors.push("personId không hợp lệ");
    } else {
      personId = data.personId;
    }
  }

  // === hometown ===
  let hometown: string | undefined = undefined;
  if (data.hometown !== undefined) {
    if (data.hometown.trim().length === 0) {
      errors.push("Quê quán không hợp lệ");
    } else {
      hometown = data.hometown;
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }

  // === return object đúng type ===
  return {
    title: data.title.trim(),
    age: age!,
    name: data.name.trim(),
    gender: gender!,
    location: data.location.trim(),
    image_url: data.image_url,
    description: data.description.trim(),
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    personId,
    date_of_birth,
    hometown,
    lost_year,
  };
};

export const validateUpdatePostRequest = (
  data: UpdatePostRequestDto,
): UpdatePostRequestDto => {
  const errors: string[] = [];
  if (data.title !== undefined && data.title.trim().length === 0) {
    errors.push("Vui lòng nhập tiêu đề");
  }
  if (data.name !== undefined && data.name.trim().length === 0) {
    errors.push("Vui lòng nhập tên người mất tích");
  }
  if (data.age !== undefined && data.age <= 0) {
    errors.push("Vui lòng nhập tuổi hợp lệ");
  }
  if (
    data.gender !== undefined &&
    !["male", "female"].includes(data.gender.toLowerCase())
  ) {
    errors.push("Vui lòng chọn giới tính hợp lệ");
  }
  if (data.location !== undefined && data.location.trim().length === 0) {
    errors.push("Vui lòng cung cấp nơi ở hiện tại");
  }
  if (
    data.status !== undefined &&
    !Object.values(PostStatus).includes(data.status as PostStatus)
  ) {
    errors.push("Vui lòng chọn trạng thái hợp lệ");
  }

  if (data.description !== undefined && data.description.trim().length === 0) {
    errors.push("Vui lòng nhập mô tả chi tiết đặc điểm nhận dạng");
  }

  if (data.date_of_birth !== undefined) {
    const d = new Date(data.date_of_birth);
    if (isNaN(d.getTime())) {
      errors.push("Vui lòng nhập ngày sinh hợp lệ");
    } else {
      data.date_of_birth = d;
    }
  }

  if (
    data.lost_year !== undefined &&
    (data.lost_year < 1900 || data.lost_year > new Date().getFullYear())
  ) {
    errors.push("Vui lòng nhập năm mất tích hợp lệ");
  }

  if (data.hometown !== undefined && data.hometown.trim().length === 0) {
    errors.push("Vui lòng nhập quê quán hợp lệ");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
  return data;
};
