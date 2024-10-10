// Libs
import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  development: {
    dialect: 'sqlite',
    storage: './db/yugioh.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    dialect: 'sqlite',
    storage: './db/yugioh.sqlite',
  },
  jwtSecret: process.env.SECRET_KEY,
  jwtSession: { session: false },
};
