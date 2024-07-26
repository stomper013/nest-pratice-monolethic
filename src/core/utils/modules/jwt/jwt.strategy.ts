import { IJwtPayload } from '@core/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'modules/auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secretKey'),
    });
  }

  async validate(payload: IJwtPayload) {
    const { userId } = payload;
    const user = this.authService.getUserById(userId);
    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
