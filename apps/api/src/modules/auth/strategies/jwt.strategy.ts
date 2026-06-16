import {
  AUTH_AT_COOKIE_NAME,
  AUTH_STRATEGY,
} from '@/common/constants/auth.constant';
import { HelpService } from '@/modules/help/help.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@/modules/users/users.service';
import { TokenPayload } from '../token-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AUTH_STRATEGY.JWT) {
  constructor(
    private readonly helpService: HelpService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req.cookies?.[AUTH_AT_COOKIE_NAME],
      ]),
      ignoreExpiration: false,
      secretOrKey: helpService.jwtAccessToken.secret,
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getUser({ email: payload.email });
  }
}
