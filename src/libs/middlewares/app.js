// Libs
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { passportAuth } from '../passport.js';

dotenv.config();

const PORT = process.env.PORT;

export const appMiddleware = (app) => {
  app.set('port', PORT);
  app.set('json spaces', 4);
  app.use(bodyParser.json());
  app.use(passportAuth().initialize());
  app.use((req, res, next) => {
    delete req.body.id;
    next();
  });
};
