import { PostResult } from "../../types/post.type";
import { PaginatedResponseDto } from "../common/pagination.dto";

export type PostResponseDto = {
  id: string;
  title: string;
  age: number;
  name: string;
  date_of_birth: Date | null;
  gender: string;
  hometown: string | null;
  location: string;
  lost_year: number | null;
  status: string;
  image_url: string | null;
  description: string;
  createdAt: Date;
  personId: string | null;
  author: {
    id: string;
    username: string;
    phone: string;
  };
  similarPersons?: {};
};

export type PostListResponseDto = PaginatedResponseDto<PostResponseDto>;
