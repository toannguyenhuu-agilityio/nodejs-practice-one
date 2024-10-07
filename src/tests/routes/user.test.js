import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import db from '../../libs/db.js';

// Routes
import { userRoute } from '../../routes/user.js';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';

jest.unstable_mockModule('../../models/user.js', () => {
  return {
    default: {
      findByPk: jest.fn(),
      destroy: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
    },
  };
});

const mockCreateUser = jest.fn((req, res, next) => res.status(201).send());
const mockGetUserById = jest.fn((req, res, next) =>
  res.status(200).json({ id: '1', email: 'toannguyen@gmail.com' }),
);
const mockDeleteUserById = jest.fn((req, res, next) => res.status(204).send());
const mockAuthenticate = jest.fn((req, res, next) => {
  // Simulate authentication
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

describe('User route', () => {
  let app;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close(); // Close the connection after tests
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    userRoute({
      app,
      createUser: mockCreateUser,
      getUserById: mockGetUserById,
      deleteUserById: mockDeleteUserById,
      authenticate: mockAuthenticate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user', () => {
    it('should return 201 and the new user if created successfully', async () => {
      const response = await request(app)
        .post('/user')
        .send({ name: 'toan', email: 'toannguyen@gmail.com', password: '123' });

      expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
      expect(response.body).toEqual({});
    });
  });

  describe('GET /user', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/user');

      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should return user data if authenticated', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(HTTP_STATUS_CODES.OK);
      expect(response.body).toEqual({ id: '1', email: 'toannguyen@gmail.com' });
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalled();
    });
  });

  describe('DELETE /user', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await request(app).delete('/user');

      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should delete user if authenticated', async () => {
      const response = await request(app)
        .delete('/user')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(mockDeleteUserById).toHaveBeenCalled();
    });
  });
});
