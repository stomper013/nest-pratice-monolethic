import { EAppEnvironment } from '@core/enums';

export default () => ({
  port: process.env.PORT || '3000',
  rootApi: 'api',
  initAccount: {
    username: process.env.INIT_USERNAME || 'mcud',
    password: process.env.INIT_PWD || 'mcud_assessment',
  },
  db: {
    postgres: {
      debug: process.env.ENVIRONMENT == EAppEnvironment.Dev ? true : false,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'username',
      password: process.env.DB_PWD || 'password',
      dbName: process.env.DB_NAME,
    },
  },
  jwt: {
    secretKey: process.env.SECRET_KEY || 'mcud_assessment_secret_key',
    refreshSecretKey:
      process.env.RF_SECRET_KEY || 'mcud_assessment_refresh_secret_key',
    jwtSecretExpirePeriod: process.env.JWT_SECRET_EXPIRE_PERIOD || 1,
    jwtRefreshSecretExpirePeriod:
      process.env.JWT_REFRESH_SECRET_EXPIRE_PERIOD || 7,
  },
});
