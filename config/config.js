// Libs
import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  development: {
    username: 'root',
    password: null,
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || 'yugioh.sqlite',
  },
  test: {
    username: 'root',
    password: null,
    dialect: 'sqlite',
    storage: 'yugioh_test.sqlite',
  },
  production: {
    username: 'root',
    password: null,
    dialect: 'sqlite',
    storage: 'yugioh_prod.sqlite',
  },
};
