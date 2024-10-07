// Libs
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { appConfig } from './config.js';

// DB
import db from './db.js';

/**
 * JWT Passport Strategy for authenticating users based on a JWT token.
 *
 * This strategy extracts the JWT token from the Authorization header and verifies
 * the token using a secret key. If the token is valid, it retrieves the user from
 * the database and attaches the user information to the request object.
 *
 */
export const passportAuth = () => {
  const params = {
    secretOrKey: appConfig.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  // Define the JWT strategy
  const strategy = new Strategy(params, async (jwtPayload, done) => {
    const userModel = db.models.User;

    try {
      // Find the user by ID from the JWT payload
      const user = await userModel.findOne({ where: { id: jwtPayload.id } });

      // If user exists, call done with the object include id and email
      if (user) {
        return done(null, {
          id: user.id,
          email: user.email,
        });
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', appConfig.jwtSession),
  };
};
