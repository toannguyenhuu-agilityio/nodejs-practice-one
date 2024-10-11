// Libs
import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || './db/yugioh.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || ':memory',
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || './db/yugioh.sqlite',
  },
  jwtSecret: process.env.SECRET_KEY,
  jwtSession: { session: false },
};
