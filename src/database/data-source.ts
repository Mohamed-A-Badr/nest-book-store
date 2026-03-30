import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();
const isTest = process.env.NODE_ENV === 'test';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: isTest
    ? config.get<string>('TEST_DB_NAME', 'test.sqlite')
    : config.get<string>('DB_NAME', 'db.sqlite'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: isTest ? [] : [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: isTest,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
