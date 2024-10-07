// Constants
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes.js';
import { MESSAGES } from '../constants/messages.js';

export const UserControllers = (userModel) => {
  return {
    /**
     * Creates a new user in the database and returns the created user data.
     *
     * @param {Object} req - The request object containing user data in req.body.
     * @param {Object} res - The response object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The created user data.
     */
    createUser: async (req, res, next) => {
      try {
        const newUser = await userModel.create(req.body);

        res.status(HTTP_STATUS_CODES.CREATED).json(newUser);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Retrieves a user by ID from the database and sends the user data as a response.
     *
     * @param {Object} req - The request object, which contains the user ID in req.params.
     * @param {Object} res - The response object used to send the user data or error message.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The response object with the user data.
     */
    getUserById: async (req, res, next) => {
      const userId = req.user.id;

      // Validate user id
      if (!userId) {
        next(MESSAGES.INVALID_USER_ID);
      }

      try {
        const user = await userModel.findByPk(userId);

        if (!user) {
          next(MESSAGES.USER_NOT_FOUND);
        }

        res.status(HTTP_STATUS_CODES.OK).json(user);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Delete a user by ID from the database and sends the message as a response.
     *
     * @param {Object} req - The request object, which contains the user ID in req.params.
     * @param {Object} res - The response object used to send the message or an error message.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The response object with the message.
     */
    deleteUserById: async (req, res, next) => {
      const userId = req.user.id;

      // Validate user id
      if (!userId) {
        next(MESSAGES.INVALID_USER_ID);
      }

      try {
        const rowDeleted = await userModel.destroy({
          where: { id: userId },
        });

        // Check if user was deleted
        if (rowDeleted) {
          res
            .status(HTTP_STATUS_CODES.OK)
            .json({ message: MESSAGES.DELETE_USER_SUCCESS });
        } else {
          // User not found
          res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ error: MESSAGES.USER_NOT_FOUND });
        }
      } catch (error) {
        next(error);
      }
    },
  };
};
