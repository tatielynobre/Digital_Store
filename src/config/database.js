import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const dialect = process.env.DB_DIALECT || 'mysql';

const sequelize =
  dialect === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || ':memory:',
        logging: false,
      })
    : new Sequelize(
        process.env.DB_NAME || 'digital_store',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 3306),
          dialect: 'mysql',
          logging: false,
        },
      );

export default sequelize;
