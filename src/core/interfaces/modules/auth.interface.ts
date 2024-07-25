import { DateUnit } from '@core/enums';

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: number;
  refreshExpiredAt: number;
  expiredDate?: Date;
}

export interface IJwtPayload {
  userId: string;
  exp?: number;
}

export interface IConfigJwt {
  secretKey: string;
  jwtSecretExpirePeriod: number;
  jwtSecretExpireDigit: DateUnit;
  jwtRefreshSecretExpirePeriod: number;
  jwtRefreshSecretExpireDigit: DateUnit;
}
