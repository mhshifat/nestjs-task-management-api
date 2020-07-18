import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOST || 'localhost',
  port: +process.env.RDS_PORT || 5432,
  username: process.env.RDS_USERNAME || 'postgres',
  password: process.env.RDS_PASSWORD || 'Mhshifat96',
  database: process.env.RDS_DB || 'task-management',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: Boolean(process.env.TYPEORM_SYNC) || true,
};
