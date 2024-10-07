import { jest } from '@jest/globals';
import db from '../../libs/db.js';

// Controllers
import { CardsControllers } from '../../controllers/cards.js';

// Mocks
import {
  mockSingleCard,
  mockCards,
  mockPayload,
  mockQuery,
} from '../../mocks/cards.js';

// Constants
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes.js';
import { MESSAGES } from '../../constants/messages.js';

jest.unstable_mockModule('../../models/cards.js', () => {
  return {
    default: {
      findOne: jest.fn(),
      destroy: jest.fn(),
      bulkCreate: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
    },
  };
});

describe('Cards controller', () => {
  let res, next, Cards;

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

    Cards = (await import('../../models/cards.js')).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new card successfully', async () => {
      const req = {
        body: mockPayload,
        user: {
          id: 1,
        },
      };

      Cards.create.mockResolvedValue(mockSingleCard);

      await CardsControllers(Cards).createCard(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.CREATED);
      expect(res.json).toBeCalledWith(mockSingleCard);
    });

    it('should create a new card failed and return an error', async () => {
      const mockError = new Error('Failed to create card');

      Cards.create.mockRejectedValue(mockError);

      const req = {
        body: {
          name: 'toan',
        },
        user: {
          id: 1,
        },
      };

      await CardsControllers(Cards).createCard(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('getCardByID', () => {
    it('should retrieve a card by ID successfully', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      Cards.findOne.mockResolvedValue(mockSingleCard);

      await CardsControllers(Cards).getCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith(mockSingleCard);
    });

    it('should call return a message error and status 400 when card ID is not supplied', async () => {
      const req = {
        params: {},
      };

      await CardsControllers(Cards).getCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_ID_IS_REQUIRED,
      });
    });

    it('should call return a message error and status 404 when card not found', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      Cards.findOne.mockResolvedValue(null);

      await CardsControllers(Cards).getCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        msg: MESSAGES.CARD_NOT_FOUND,
      });
    });

    it('should call next with an error and status 500 when an error occurs ', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      Cards.findOne.mockRejectedValue(mockError);

      await CardsControllers(Cards).getCardByID(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('editCardByID', () => {
    it('should update existing card by ID successfully', async () => {
      const req = {
        params: {
          id: '1',
        },
        body: { ...mockPayload, update: jest.fn() },
      };

      const mockCard = {
        update: jest.fn().mockResolvedValue(true), // Simulate successful update
      };

      Cards.findByPk.mockResolvedValue(mockCard);

      await CardsControllers(Cards).editCardByID(req, res, next);

      expect(mockCard.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith(mockCard);
    });

    it('should call return a message error and status 400 when card ID is not supplied', async () => {
      const req = {
        params: {},
      };

      CardsControllers(Cards).getCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_ID_IS_REQUIRED,
      });
    });

    it('should call return a message error and status 404 when card not found', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      Cards.findByPk.mockResolvedValue(null);

      await CardsControllers(Cards).editCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_NOT_FOUND,
      });
    });

    it('should call next with an error and status 500 when an error occurs ', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      Cards.findByPk.mockRejectedValue(mockError);

      await CardsControllers(Cards).editCardByID(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('deleteCardByID', () => {
    it('should delete existing card by ID successfully', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      const mockCard = {
        destroy: jest.fn().mockResolvedValue(true), // Simulate successful deletion
      };

      Cards.findByPk.mockResolvedValue(mockCard);

      await CardsControllers(Cards).deleteCardByID(req, res, next);

      expect(mockCard.destroy).toBeCalled();
      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.NO_CONTENT);
      expect(res.json).toBeCalledWith(MESSAGES.DELETE_CARD_SUCCESS);
    });

    it('should call return a message error and status 400 when card ID is not supplied', async () => {
      const req = {
        params: {},
      };

      CardsControllers(Cards).deleteCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_ID_IS_REQUIRED,
      });
    });

    it('should call return a message error and status 404 when card not found', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      Cards.findByPk.mockResolvedValue(null);

      await CardsControllers(Cards).deleteCardByID(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
      expect(res.json).toBeCalledWith({
        message: MESSAGES.CARD_NOT_FOUND,
      });
    });

    it('should call next with an error and status 500 when an error occurs ', async () => {
      const req = {
        params: {
          id: '1',
        },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      Cards.findByPk.mockRejectedValue(mockError);

      await CardsControllers(Cards).deleteCardByID(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });

  describe('getCards', () => {
    it('should get filtered card list successfully', async () => {
      const req = {
        query: mockQuery,
      };

      const mockFilteredCards = {
        rows: mockCards,
        count: 1,
      };

      Cards.findAndCountAll.mockResolvedValue(mockFilteredCards);

      await CardsControllers(Cards).getCards(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toBeCalledWith({
        cards: mockCards,
        pagination: {
          totalPages: 1,
          totalItems: 1,
          currentPage: parseInt(1, 10),
          nextPage: null,
          previousPage: null,
        },
      });
    });

    it('should return status 400, an object with a message error and code when card ID is not supplied', async () => {
      const req = {
        query: { ...mockQuery, limit: 101 },
      };

      CardsControllers(Cards).getCards(req, res, next);

      expect(res.status).toBeCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.json).toBeCalledWith({
        error: {
          code: MESSAGES.INVALID_PARAMETER,
          message: MESSAGES.INVALID_LIMIT,
        },
      });
    });

    it('should call next with an error and status 500 when an error occurs ', async () => {
      const req = {
        query: { number: 'ABCD-EF123', name: 'Card 1' },
      };

      const mockError = new Error(MESSAGES.INTERNAL_SERVER_ERROR);

      Cards.findAndCountAll.mockRejectedValue(mockError);

      await CardsControllers(Cards).getCards(req, res, next);

      expect(next).toBeCalledWith(mockError);
    });
  });
});
