import { User } from "../../generated/prisma/client";
import { prisma } from "../configs/prisma";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIds(id: string[]): Promise<User[]> {
    return prisma.user.findMany({
      where: { id: { in: id } },
    });
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    phone: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  }
}

const userRepository = new UserRepository();
export default userRepository;
