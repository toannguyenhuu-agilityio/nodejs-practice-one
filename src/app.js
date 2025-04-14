// Libs
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import { passportAuth } from './libs/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';

// DB
import db from './libs/db.js';

// Models
import User from './models/user.js';
import Cards from './models/cards.js';

// Routes
import { cardRoute } from './routes/cards.js';
import { userRoute } from './routes/user.js';
import { tokenRoute } from './routes/token.js';

// Middlewares
import { appMiddleware } from './libs/middlewares/app.js';
import { errorHandler } from './libs/middlewares/errorHandler.js';
import { validateCard } from './libs/middlewares/card.js';

// Controllers
import { TokenControllers } from './controllers/token.js';
import { CardsControllers } from './controllers/cards.js';
import { UserControllers } from './controllers/user.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

appMiddleware(app);

// Serve static files (index.html, CSS, JS, etc.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Extract controllers
const { createToken } = TokenControllers(User, jwt);
const { createCard, getCardByID, editCardByID, deleteCardByID, getCards } =
  CardsControllers(Cards);
const { createUser, getUserById, deleteUserById } = UserControllers(User);

const authenticate = passportAuth().authenticate();

cardRoute({
  app,
  createCard,
  getCardByID,
  editCardByID,
  deleteCardByID,
  getCards,
  validateCard,
  authenticate,
});
userRoute({
  app,
  createUser,
  getUserById,
  deleteUserById,
  authenticate,
});
tokenRoute(app, createToken);

app.use(errorHandler);

/**
 * Starts the Express server and connects to the SQL database.
 */
const startServer = async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => console.log('Server running on port 3000'));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

export default app;
