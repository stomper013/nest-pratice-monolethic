import { BaseRepository, User } from '@core/database';
import { DateUnit } from '@core/enums';
import { IConfigJwt, IJwtResponse, ILoginPayload } from '@core/interfaces';
import { CryptoService, LoggerService, TimestampUtil } from '@core/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'modules/user';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import randomatic from 'randomatic';

@Injectable()
export class AuthService extends BaseRepository {
  private readonly serviceName: string = AuthService.name;
  private readonly logger: LoggerService;

  private jwtSecretExpirePeriod = 1;
  private jwtSecretExpireDigit: DateUnit = DateUnit.Day;
  private jwtRefreshSecretExpirePeriod = 7;
  private jwtRefreshSecretExpireDigit: DateUnit = DateUnit.Day;
  private secretKey: string;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);

    this.getConfigJwt();
  }

  async register(payload: User): Promise<IJwtResponse> {
    try {
      const record = await this.userService.createUser(payload);

      const jwtResponse = this.generateToken(record);

      return jwtResponse;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(payload: ILoginPayload): Promise<IJwtResponse> {
    const em = this.entityManager.fork();
    try {
      const { username, password } = payload;
      const user = await this.getOne(em, User, { username });
      if (!user) throw new UnauthorizedException();

      const checkPassword = this.cryptoService.verify(password, user.password);
      if (!checkPassword) throw new UnauthorizedException();

      const jwtResponse = this.generateToken(user);

      return jwtResponse;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  generateToken(payload: User): IJwtResponse {
    const refreshExpiredDate = TimestampUtil.addTime(
      this.jwtRefreshSecretExpirePeriod,
      this.jwtRefreshSecretExpireDigit,
    );
    const accessExpiredDate = TimestampUtil.addTime(
      this.jwtSecretExpirePeriod,
      this.jwtSecretExpireDigit,
    );

    const [accessToken, refreshToken] = [
      this.jwtService.generate(payload, this.secretKey),
      randomatic('Aa0', 64),
    ];

    return {
      accessToken,
      refreshToken,
      expiredDate: refreshExpiredDate,
      accessExpiredAt: TimestampUtil.convertDateToSecond(accessExpiredDate),
      refreshExpiredAt: TimestampUtil.convertDateToSecond(refreshExpiredDate),
    };
  }

  getConfigJwt() {
    const jwtConfig = this.configService.get<IConfigJwt>('jwt');

    for (const key in jwtConfig) {
      let value = jwtConfig[key];
      console.log(value instanceof Number, typeof value);

      if (value instanceof Number) value = Number(value);
      this[key] = value;
    }

    this.jwtService = new JwtService(
      this.jwtSecretExpirePeriod,
      this.jwtSecretExpireDigit,
    );
  }
}
