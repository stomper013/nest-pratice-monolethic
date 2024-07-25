import { BaseRepository, User } from '@core/database';
import { CryptoService, LoggerService } from '@core/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService extends BaseRepository implements OnModuleInit {
  private readonly serviceName: string = UserService.name;
  private readonly logger: LoggerService;
  constructor(
    private readonly entityManager: EntityManager,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async onModuleInit() {
    const em = this.entityManager.fork();
    try {
      const initUserData = this.configService.get<User>('initAccount');
      if (!initUserData) return;

      const checkExisted = await this.getOne(em, User, {
        username: initUserData.username,
      });
      if (checkExisted) return;

      const record = await this.createUser(initUserData);

      this.logger.verbose('Default user initialized');

      return record;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async createUser(payload: User): Promise<User> {
    const em = this.entityManager.fork();
    try {
      const { password, username } = payload;
      if (!password) throw new BadRequestException('Empty password');

      const checkExistedUsername = await this.getOne(em, User, { username });
      if (checkExistedUsername)
        throw new BadRequestException('Username existed');

      const hashedPassword = this.cryptoService.computeSHA1OfMD5(password);
      const record = await this.insert(
        em,
        User,
        Object.assign(payload, { password: hashedPassword }),
      );

      return record;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const em = this.entityManager.fork();
    try {
      const user = await this.getOne(em, User, { id });
      if (!user) throw new NotFoundException('Not found user');

      const hashedPassword = this.cryptoService.computeSHA1OfMD5(newPassword);
      user.password = hashedPassword;

      await em.flush();

      return user;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }
}
