import path from 'path';

export default {
  development: {
    username: 'root',
    password: null,
    database: 'database_development',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: path.resolve('db', 'yugioh.sqlite'),
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: path.resolve('db', 'yugioh-test.sqlite'),
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: path.resolve('db', 'yugioh-production.sqlite'),
  },
};
