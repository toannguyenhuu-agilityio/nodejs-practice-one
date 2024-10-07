import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { cardRoute } from '../../routes/cards.js';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';

jest.unstable_mockModule('../../libs/passport.js', () => ({
  passportAuth: jest.fn(() => ({
    authenticate: jest
      .fn()
      .mockImplementation(() => (req, res, next) => next()),
  })),
}));

describe('CardRoute', () => {
  let app;
  let mockCreateCard;
  let mockGetCardByID;
  let mockEditCardByID;
  let mockDeleteCardByID;
  let mockGetCards;
  let mockAuthenticate;
  let mockValidateCard;

  beforeEach(() => {
    app = express();

    mockCreateCard = jest.fn((req, res) =>
      res.status(201).send({ message: 'Card created' }),
    );
    mockGetCardByID = jest.fn((req, res) =>
      res.status(200).send({ id: req.params.id }),
    );
    mockEditCardByID = jest.fn((req, res) =>
      res.status(200).send({ message: 'Card updated' }),
    );
    mockDeleteCardByID = jest.fn((req, res) => res.status(204).send());
    mockGetCards = jest.fn((req, res) =>
      res.status(200).send([{ id: 1 }, { id: 2 }]),
    );
    mockValidateCard = jest.fn((req, res, next) => next());
    mockAuthenticate = jest.fn((req, res, next) => {
      // Simulate authentication
      if (req.headers.authorization) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    });

    cardRoute({
      app,
      createCard: mockCreateCard,
      getCardByID: mockGetCardByID,
      editCardByID: mockEditCardByID,
      deleteCardByID: mockDeleteCardByID,
      getCards: mockGetCards,
      authenticate: mockAuthenticate,
      validateCard: mockValidateCard,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /cards', () => {
    it('should create a card', async () => {
      const response = await request(app)
        .post('/cards')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Test Card' }); // Replace with actual card data

      expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
      expect(response.body).toEqual({ message: 'Card created' });
      expect(mockValidateCard).toHaveBeenCalled();
      expect(mockCreateCard).toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post('/cards');

      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('GET /cards', () => {
    it('should retrieve all cards', async () => {
      const response = await request(app)
        .get('/cards')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(HTTP_STATUS_CODES.OK);
      expect(response.body).toEqual([{ id: 1 }, { id: 2 }]);
      expect(mockGetCards).toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/cards');

      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('GET /cards/:id', () => {
    it('should retrieve a specific card by id', async () => {
      const response = await request(app)
        .get('/cards/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(HTTP_STATUS_CODES.OK);
      expect(response.body).toEqual({ id: '1' });
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/cards/1');

      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('PUT /cards/:id', () => {
    it('should retrieve card by id', async () => {
      const response = await request(app)
        .put('/cards/1')
        .send({ name: 'Updated Card' })
        .set('Authorization', 'Bearer token');
      expect(response.status).toBe(HTTP_STATUS_CODES.OK);
      expect(response.body).toEqual({ message: 'Card updated' });
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/cards/1');
      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('DELETE /cards/:id', () => {
    it('should delete card by id successfully', async () => {
      const response = await request(app)
        .delete('/cards/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/cards/1');
      expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(response.text).toBe('Unauthorized');
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });
});
