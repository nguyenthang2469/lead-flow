import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserRole } from '@/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { TUser } from '@repo/types';
import { TokenPayload } from './token-payload.interface';
import { HelpService } from '../help/help.service';
import { USER_PUBLIC_SELECT } from '@/common/constants/user.constant';
import { AUTH_AT_COOKIE_NAME } from '@/common/constants/auth.constant';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    private readonly helpService: HelpService
  ) {}

  async register(dto: Prisma.UserCreateInput) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: dto.role ?? UserRole.USER,
      },
      select: USER_PUBLIC_SELECT,
    });
    return user;
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(plainPassword, user.password);
    if (!ok) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async login(user: TUser, res: Response) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwt.signAsync(payload);
    res.cookie(AUTH_AT_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.helpService.jwtAccessToken.expiresInMs,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  logout(res: Response) {
    res.clearCookie(AUTH_AT_COOKIE_NAME);
    return { message: 'Logout successful' };
  }
}
