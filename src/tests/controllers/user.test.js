import { jest } from '@jest/globals';
import db from '../../libs/db.js';

// Controllers
import { UserControllers } from '../../controllers/user.js';

// Mocks
import { mockUser } from '../../mocks/user.js';

// Constants
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';
import { MESSAGES } from '../../constants/messages.js';

jest.unstable_mockModule('../../models/user.js', () => {
  return {
    default: {
      findByPk: jest.fn(),
      destroy: jest.fn(),
      create: jest.fn(),
    },
  };
});

describe('User controller', () => {
  let res, next, User;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true }); // Ensure the tables are created before tests
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    User = (await import('../../models/user.js')).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const req = {
        body: {
          name: 'toan',
          email: 'toannguyen@gmail.com',
          password: '123',
        },
      };

      User.create.mockResolvedValue(mockUser);

      await UserControllers(User).createUser(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.CREATED);
      expect(res.json).toBeCalledWith(mockUser);
    });

    it('should create a new user failed and return an error', async () => {
      const mockError = new Error('Failed to create user');

      User.create.mockRejectedValue(mockError);

      const req = {
        body: {
          name: 'toan',
        },
      };

      await UserControllers(User).createUser(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      User.findByPk.mockResolvedValue(mockUser);

      await UserControllers(User).getUserById(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith(mockUser);
    });

    it('should call next with message error when userId is invalid', async () => {
      const req = {
        user: {},
      };

      await UserControllers(User).getUserById(req, res, next);

      expect(next).toBeCalledWith(MESSAGES.INVALID_USER_ID);
    });

    it('should call next with message error when user not found', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      User.findByPk.mockResolvedValue(null);

      await UserControllers(User).getUserById(req, res, next);

      expect(next).toBeCalledWith(MESSAGES.USER_NOT_FOUND);
    });

    it('should call next with an error when an error occurs ', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      User.findByPk.mockRejectedValue(mockError);

      await UserControllers(User).getUserById(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID successfully', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      // Fetch the card ID from the database
      User.destroy.mockResolvedValue(1);

      await UserControllers(User).deleteUserById(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.DELETE_USER_SUCCESS,
      });
    });

    it('should call next with message error when userId is invalid', async () => {
      const req = {
        user: {},
      };

      await UserControllers(User).deleteUserById(req, res, next);

      expect(next).toBeCalledWith(MESSAGES.INVALID_USER_ID);
    });

    it('should call next with message error when user not found', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      User.destroy.mockResolvedValue(null);

      await UserControllers(User).deleteUserById(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        error: MESSAGES.USER_NOT_FOUND,
      });
    });

    it('should call next with an error when there is thrown an error ', async () => {
      const req = {
        user: {
          id: '1',
        },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      User.destroy.mockRejectedValue(mockError);

      await UserControllers(User).deleteUserById(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });
});
