import { Prisma } from "../../generated/prisma/client";
import { PaginatedResult } from "../dtos/common/pagination.dto";

export const postSelect = {
  id: true,
  title: true,
  age: true,
  name: true,
  date_of_birth: true,
  gender: true,
  hometown: true,
  location: true,
  lost_year: true,
  status: true,
  image_url: true,
  description: true,
  createdAt: true,
  personId: true,
  author: {
    select: {
      id: true,
      username: true,
      phone: true,
    },
  },
  pendingPersonIds: true
} satisfies Prisma.PostSelect;

export type PostResult = Prisma.PostGetPayload<{ select: typeof postSelect }>;
export type PostListResult = PaginatedResult<PostResult>;
