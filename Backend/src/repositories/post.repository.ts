import { prisma } from "../configs/prisma";
import { PostResult, postSelect } from "../types/post.type";
import { CreatePostRequestDto } from "../dtos/post";

export class PostRepository {
  findBasicInfoById = async (postId: string) => {
    return prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        personId: true,
      },
    });
  };

  findById = async (postId: string) => {
    return prisma.post.findUnique({
      where: { id: postId },
      select: postSelect,
    });
  };

  findAllPosts = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: "CONFIRMED" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: postSelect,
      }),
      prisma.post.count({
        where: { status: "CONFIRMED" }
      }),
    ]);

    return { data, total };
  };

  findMyPosts = async (authorId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: postSelect,
      }),
      prisma.post.count({ where: { authorId } }),
    ]);

    return { data, total };
  };

  findByPersonIds = async (personIds: string[]) => {
    return prisma.post.findMany({
      where: {
        personId: {
          in: personIds,
        },
      },
      orderBy: { createdAt: "asc" },
      select: postSelect,
    });
  };

  create = async (
    data: CreatePostRequestDto & { authorId: string },
  ): Promise<PostResult> => {    
    return prisma.post.create({
      data,
      select: postSelect,
    });
  };

  update = async (postId: string, data: Partial<CreatePostRequestDto>) => {
    return prisma.post.update({
      where: { id: postId },
      data,
      select: postSelect,
    });
  };

  delete = async (postId: string) => {
    return prisma.post.delete({
      where: { id: postId },
    });
  };
}

const postRepository = new PostRepository();
export default postRepository;
