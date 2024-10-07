import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import db from '../../libs/db.js';

// Routes
import { tokenRoute } from '../../routes/token.js';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';

// Controllers
import { TokenControllers } from '../../controllers/token.js';

jest.unstable_mockModule('../../models/user.js', () => {
  return {
    default: {
      findOne: jest.fn(),
      isPassword: jest.fn(),
    },
  };
});

describe('Token route', () => {
  let app, res, next, User, jwt;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    await jest.unstable_mockModule('jwt-simple', () => ({
      encode: jest.fn(), // Mock the encode function
      decode: jest.fn(), // Mock the decode function if needed
    }));

    app = express();
    app.use(express.json()); // Middleware to parse JSON
    User = (await import('../../models/user.js')).default;

    jwt = await import('jwt-simple');

    const { createToken } = TokenControllers(User, jwt);

    tokenRoute(app, createToken);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 and the new token if created successfully', async () => {
    const mockUser = { id: 1, username: 'Player1' };
    const mockToken = 'mocked.jwt.token';

    User.findOne.mockResolvedValue(mockUser);
    User.isPassword.mockResolvedValue(true);

    jwt.encode.mockReturnValue(mockToken);

    const response = await request(app)
      .post('/token')
      .send({ email: 'toannguyen@gmail.com', password: '123' });

    expect(response.status).toBe(HTTP_STATUS_CODES.OK);
    expect(response.body).toEqual({ token: mockToken });
  });
});
