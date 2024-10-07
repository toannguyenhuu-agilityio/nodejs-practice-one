// Libs
import { appConfig } from '../libs/config.js';

// Constants
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes.js';
import { MESSAGES } from '../constants/messages.js';

export const TokenControllers = (userModel, jwt) => {
  return {
    /**
     * Create a token for a user and sends it as a response.
     *
     * @param {Object} req - The request object, which contains the user email and password in req.body.
     * @param {Object} res - The response object used to send the token or error message.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The response object with the token.
     */
    createToken: async (req, res, next) => {
      const { email, password } = req.body;

      // Validate credentials
      const isValidateCredentials = !email || !password;

      if (isValidateCredentials) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED);

        next(MESSAGES.INVALID_CREDENTIALS);
      }

      try {
        const user = await userModel.findOne({ where: { email } });

        // Validate password from the request body with the hashed password user created before
        const isPasswordInCorrect =
          !user || !userModel.isPassword(user.password, password);

        if (isPasswordInCorrect) {
          res.status(HTTP_STATUS_CODES.UNAUTHORIZED);
          next(MESSAGES.INVALID_CREDENTIALS);
        }

        const payload = {
          id: user.id,
        };

        const token = jwt.encode(payload, appConfig.jwtSecret);

        res.status(HTTP_STATUS_CODES.OK).json({ token });
      } catch (error) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED);
        next(error);
      }
    },
  };
};
