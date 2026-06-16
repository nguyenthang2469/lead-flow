import { AUTH_STRATEGY } from '@/common/constants/auth.constant';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGY.LOCAL) {}
