import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT),
  logging: true,
  synchronize: process.env.ENV === 'dev' ? true : false,
  entities: [`${__dirname}**/**/*.entity{.js,.ts}`],
  migrations: [`${__dirname}/db/migrations/*{.js,.ts}`],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
