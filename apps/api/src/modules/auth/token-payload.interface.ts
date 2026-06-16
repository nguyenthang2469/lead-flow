import { EUserRole } from '@repo/types';

export interface TokenPayload {
  sub: string;
  email: string;
  role: EUserRole;
}
