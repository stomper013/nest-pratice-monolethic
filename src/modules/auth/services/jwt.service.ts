import { DateUnit } from '@core/enums';
import { IJwtPayload } from '@core/interfaces';
import { TimestampUtil } from '@core/utils';
import * as jwt from 'jsonwebtoken';

export class JwtService {
  expiredPeriod: number;
  expiredDigit: DateUnit;
  constructor(expiredPeriod: number, expiredDigit: DateUnit) {
    this.expiredPeriod = expiredPeriod;
    this.expiredDigit = expiredDigit;
  }

  generate(payload: object, secretKey: string): string {
    return jwt.sign(
      {
        ...payload,
        exp: TimestampUtil.convertDateToSecond(
          TimestampUtil.addTime(this.expiredPeriod, this.expiredDigit),
        ),
      },
      secretKey,
    );
  }

  static decode(token: string): IJwtPayload {
    return jwt.decode(token);
  }

  static verify(token: string, secretKeyJwt: string) {
    return jwt.verify(token, secretKeyJwt, { ignoreExpiration: false });
  }
}
