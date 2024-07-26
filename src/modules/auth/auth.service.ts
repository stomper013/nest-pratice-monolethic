import { BaseRepository, User } from '@core/database';
import { DateUnit } from '@core/enums';
import {
  IConfigJwt,
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
  IRegisterPayload,
} from '@core/interfaces';
import { CryptoService, LoggerService, TimestampUtil } from '@core/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user';

@Injectable()
export class AuthService extends BaseRepository {
  private readonly serviceName: string = AuthService.name;
  private readonly logger: LoggerService;

  private jwtSecretExpirePeriod: number;
  private jwtRefreshSecretExpirePeriod: number;
  private secretKey: string;
  private refreshSecretKey: string;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);

    this.getConfigJwt();
  }

  getError(){
    try {
      throw new Error('TEST')
    }catch(error){
      this.logger.debug(error)
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getConfigJwt() {
    const jwtConfig = this.configService.get<IConfigJwt>('jwt');
    console.log(jwtConfig);


    for (const key in jwtConfig) {
      let value = jwtConfig[key];
      if (!isNaN(value)) value = Number(value);
      this[key] = value;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const em = this.entityManager.fork();
    try {
      const user = await this.getOne(em, User, { id });

      if (!user) return null;

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async register(payload: IRegisterPayload): Promise<IJwtResponse> {
    try {
      const jwtResponse = this.generateToken(payload);
      const { refreshToken, refreshExpiredDate } = jwtResponse;

      const userPayload: User = Object.assign(payload, {
        token: refreshToken,
        tokenExpireDate: refreshExpiredDate,
      });

      await this.userService.createUser(userPayload);

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
      let user = await this.getOne(em, User, { username });
      if (!user) throw new UnauthorizedException();

      const checkPassword = this.cryptoService.verify(password, user.password);
      if (!checkPassword) throw new UnauthorizedException();

      const jwtResponse = this.generateToken(user);
      const { refreshToken: newToken, refreshExpiredDate } = jwtResponse;

      user = Object.assign(user, {
        token: newToken,
        tokenExpireDate: refreshExpiredDate,
      });

      await em.flush();

      return jwtResponse;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async validRefreshToken(refreshToken: string): Promise<IJwtResponse> {
    const em = this.entityManager.fork();
    try {
      const jwtPayload = this.jwtService.decode<IJwtPayload>(refreshToken);
      const { userId } = jwtPayload;

      let user = await this.getOne(em, User, {
        id: userId,
        token: refreshToken,
      });
      if (!user) throw new UnauthorizedException();

      const { token, tokenExpireDate } = user;
      if (!token || token !== refreshToken) throw new UnauthorizedException();

      if (tokenExpireDate < TimestampUtil.getCurrentTimestamp())
        throw new UnauthorizedException();

      const newJwtToken = this.generateToken(user);
      const { refreshToken: newToken, refreshExpiredDate } = newJwtToken;

      user = Object.assign(user, {
        token: newToken,
        tokenExpireDate: refreshExpiredDate,
      });

      await em.flush();

      return newJwtToken;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  generateToken(payload: Partial<User>): IJwtResponse {
    const { id, username } = payload;
    const [accessExpiredDate, refreshExpiredDate] = [
      TimestampUtil.addTime(this.jwtSecretExpirePeriod, DateUnit.Second),
      TimestampUtil.addTime(this.jwtRefreshSecretExpirePeriod, DateUnit.Second),
    ];

    const [accessToken, refreshToken] = [
      this.jwtService.sign(
        { userId: id },
        {
          secret: this.secretKey,
          expiresIn: this.jwtSecretExpirePeriod,
        },
      ),
      this.jwtService.sign(
        { userId: id, username },
        {
          secret: this.refreshSecretKey,
          expiresIn: this.jwtRefreshSecretExpirePeriod,
        },
      ),
    ];

    return {
      accessToken,
      refreshToken,
      accessExpiredDate,
      refreshExpiredDate,
      accessExpiredAt: TimestampUtil.convertDateToSecond(accessExpiredDate),
      refreshExpiredAt: TimestampUtil.convertDateToSecond(refreshExpiredDate),
    };
  }
}
