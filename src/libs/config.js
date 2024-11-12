// Libs
import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  development: {
    database: 'database_development',
    dialect: 'sqlite',
    storage: 'db/yugioh.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory',
  },
  production: {
    dialect: 'sqlite',
    storage: 'yugioh.sqlite',
  },
  jwtSecret: process.env.SECRET_KEY,
  jwtSession: { session: false },
};
