import { DataSource, DataSourceOptions } from 'typeorm';

const isTest = process.env.NODE_ENV === 'test';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: isTest ? [] : [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: isTest,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
