import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { USER_PUBLIC_SELECT } from '@/common/constants/user.constant';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  getUsersList() {
    return this.prismaService.user.findMany({ select: USER_PUBLIC_SELECT });
  }

  async getUser(findObject: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({
      where: findObject,
      select: USER_PUBLIC_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.getUser({ id });
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prismaService.user.findFirst({
        where: { email: data.email as string, id: { not: id } },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    await this.getUser({ id });
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
