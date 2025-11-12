import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  env: NodeJS.ProcessEnv,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  autoLoadEntities: true, // keep it simple for demo
  synchronize: true,
  logging: false,
});
