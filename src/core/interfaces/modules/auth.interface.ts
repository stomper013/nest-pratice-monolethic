import { DateUnit } from '@core/enums';

export interface ILoginPayload {
  username: string;
  password: string;
}

export type IRegisterPayload = ILoginPayload;

export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: number;
  refreshExpiredAt: number;
  accessExpiredDate?: Date;
  refreshExpiredDate?: Date;
}

export interface IJwtPayload {
  userId: string;
  username?: string;
  exp?: number;
}

export interface IConfigJwt {
  secretKey: string;
  jwtSecretExpirePeriod: number;
  jwtSecretExpireDigit: DateUnit;
  jwtRefreshSecretExpirePeriod: number;
  jwtRefreshSecretExpireDigit: DateUnit;
}
