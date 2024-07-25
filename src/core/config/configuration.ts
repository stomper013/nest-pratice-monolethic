export default () => ({
  port: process.env.PORT || '3000',
  rootApi: 'api',
  // initAccount: {
  //   username: process.env.INIT_ADMIN_USERNAME || 'admin',
  //   password: process.env.INIT_ADMIN_PWD || 'password',
  //   exchangePassword: process.env.INIT_ADMIN_EX_PWD || 'expassword',
  //   phone: process.env.INIT_ADMIN_PHONE || '0123456789',
  // },
  db: {
    postgres: {
      databaseConfig: {
        type: process.env.DB_TYPE || 'postgres',
        synchronize: false,
        logging: false,
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'username',
        password: process.env.DB_PWD || 'password',
        extra: {
          connectionLimit: 10,
        },
        autoLoadEntities: true,
      },
    },
  },
  jwt: {
    jwtSecretExpirePeriod: process.env.JWT_SECRET_EXPIRE_PERIOD || 1,
    jwtSecretExpireDigit: process.env.JWT_SECRET_EXPIRE_DIGIT || 'day',
    jwtRefreshSecretExpirePeriod:
      process.env.JWT_REFRESH_SECRET_EXPIRE_PERIOD || 7,
    jwtRefreshSecretExpireDigit:
      process.env.JWT_REFRESH_SECRET_EXPIRE_DIGIT || 'day',
  },
});
