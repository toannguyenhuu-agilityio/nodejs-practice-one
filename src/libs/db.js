import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import Sequelize from 'sequelize';
import { appConfig } from './config.js';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(appConfig[env]);

const db = { sequelize, Sequelize, models: {} };

// Get the current directory
const relativePathToDataDir = '../../src';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = resolve(__dirname, relativePathToDataDir);

const dir = join(targetPath, 'models');

fs.readdirSync(dir).forEach(async (file) => {
  const model = await import(join(dir, file));

  db.models[model.default.name] = model.default;
});

Object.keys(db.models).forEach((key) => {
  db.models[key].associate(db.models);
});

export default db;
