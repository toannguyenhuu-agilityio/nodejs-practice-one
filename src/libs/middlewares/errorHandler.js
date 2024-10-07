// Constants
import { MESSAGES } from '../../constants/messages.js';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';

export const errorHandler = (err, req, res) => {
  if (err === MESSAGES.INVALID_USER_ID) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST);
  }

  console.error(err.stack);

  res.status(err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: {
      message: err.message || MESSAGES.INTERNAL_SERVER_ERROR,
    },
  });
};
