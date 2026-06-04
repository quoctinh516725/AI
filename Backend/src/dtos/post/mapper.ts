import { PostResult } from "../../types/post.type";
import { PostResponseDto } from "./post.response.dto";
import { UpdatePostRequestDto } from "./post.request.dto";

export const mapPostToResponse = (
  post: PostResult & {
    similarPersons?: {
      personId: string;
      postId: string;
      image_url: string | null;
      name: string;
      age: number;
      date_of_birth: Date | null;
    }[];
  },
): PostResponseDto => {
  return {
    id: post.id,
    title: post.title,
    age: post.age,
    name: post.name,
    date_of_birth: post.date_of_birth,
    gender: post.gender,
    hometown: post.hometown,
    location: post.location,
    lost_year: post.lost_year,
    status: post.status,
    image_url: post.image_url,
    description: post.description,
    createdAt: post.createdAt,
    personId: post.personId,
    author: {
      id: post.author.id,
      username: post.author.username,
      phone: post.author.phone,
    },
    similarPersons: post.similarPersons || [],
  };
};

export const mapUpdatePostRequestToData = (dto: UpdatePostRequestDto) => {
  const data: any = {};
  if (dto.title !== undefined) data.title = dto.title;
  if (dto.age !== undefined) data.age = dto.age;
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.gender !== undefined) data.gender = dto.gender;
  if (dto.location !== undefined) data.location = dto.location;
  if (dto.status !== undefined) data.status = dto.status;
  if (dto.description !== undefined) data.description = dto.description;
  if (dto.date_of_birth !== undefined) data.date_of_birth = dto.date_of_birth;
  if (dto.hometown !== undefined) data.hometown = dto.hometown;
  if (dto.lost_year !== undefined) data.lost_year = dto.lost_year;
  return data;
};
