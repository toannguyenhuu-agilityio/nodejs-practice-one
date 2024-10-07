// Libs
import { jest } from '@jest/globals';
import db from '../../libs/db.js';

// Controllers
import { TokenControllers } from '../../controllers/token.js';

// Mocks
import { mockUser } from '../../mocks/user.js';

// Constants
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';
import { MESSAGES } from '../../constants/messages.js';

jest.unstable_mockModule('../../models/user.js', () => {
  return {
    default: {
      findOne: jest.fn(),
      create: jest.fn(),
      isPassword: jest.fn(),
    },
  };
});

describe('Token controller', () => {
  let res, next, User;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true }); // Ensure the tables are created before tests
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    await jest.unstable_mockModule('jwt-simple', () => ({
      encode: jest.fn(), // Mock the encode function
      decode: jest.fn(), // Mock the decode function if needed
    }));

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

  describe('createToken', () => {
    it('should create a new token successfully', async () => {
      const jwt = await import('jwt-simple');
      const mockToken = 'mockedjwttoken';
      const req = {
        body: {
          email: 'toannguyen@gmail.com',
          password: '123',
        },
      };

      User.findOne.mockResolvedValue(mockUser);
      User.isPassword.mockResolvedValue(true);

      jwt.encode.mockReturnValue(mockToken);

      await TokenControllers(User, jwt).createToken(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith({ token: mockToken });
    });

    it('should return a 401 and call next with invalid credentials if password is incorrect or user does not exist', async () => {
      const jwt = await import('jwt-simple');
      const req = {
        body: {
          email: 'toannguyen@gmail.com',
          password: '12',
        },
      };

      User.findOne.mockResolvedValue(mockUser);
      User.isPassword.mockReturnValue(false);

      await TokenControllers(User, jwt).createToken(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(next).toBeCalledWith(MESSAGES.INVALID_CREDENTIALS);
    });

    it('should return a 401 and call next with invalid credentials if password is incorrect or email does not exist', async () => {
      const jwt = await import('jwt-simple');
      const req = {
        body: {
          email: 'toannguyen@gmail.com',
        },
      };

      await TokenControllers(User, jwt).createToken(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(next).toBeCalledWith(MESSAGES.INVALID_CREDENTIALS);
    });
  });
});
