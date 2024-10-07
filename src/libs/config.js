// Libs
import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  development: {
    dialect: 'sqlite',
    storage: 'yugioh.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  jwtSecret: process.env.SECRET_KEY,
  jwtSession: { session: false },
};
