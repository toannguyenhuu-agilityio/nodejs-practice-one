// Libs
import { Op } from 'sequelize';

// Constants
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes.js';
import { MESSAGES } from '../constants/messages.js';

export const CardsControllers = (cardsModel) => {
  return {
    /**
     * Creates a new card in the database and returns the created card data.
     *
     * @param {Object} req - The request object containing card data in req.body.
     * @param {Object} res - The response object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The created card data.
     */
    createCard: async (req, res, next) => {
      try {
        const newCard = await cardsModel.create({
          ...req.body,
          userId: req.user.id,
        });

        res.status(HTTP_STATUS_CODES.CREATED).json(newCard);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Fetches an existing card by Id from the database and sends the card data as a response.
     *
     * @param {Object} req - The request object containing the cardId in the URL parameters
     * @param {Object} res - The response card object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The card data.
     */
    getCardByID: async (req, res, next) => {
      const { id } = req.params;

      // Check if ID is supplied
      if (!id) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.CARD_ID_IS_REQUIRED });
      }

      try {
        const newCard = await cardsModel.findOne({
          where: req.params,
        });

        // If the card is not found, return a 404 error
        if (!newCard) {
          return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            msg: MESSAGES.CARD_NOT_FOUND,
          });
        }

        res.status(HTTP_STATUS_CODES.OK).json(newCard);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Updates the details of an existing card in the database.
     *
     * @param {Object} req - The request object containing the cardId in the URL parameters
     * @param {Object} res - The response object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {void} - Returns the updated card object in JSON format on successful update,
     *                   or an appropriate error response if the card is not found,
     *                   if validation fails, or if an error occurs.
     */
    editCardByID: async (req, res, next) => {
      const { id } = req.params;

      // Check if ID is supplied
      if (!id) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.CARD_ID_IS_REQUIRED });
      }

      try {
        // Find the card by the id param in the database
        const card = await cardsModel.findByPk(req.params.id);

        // If the card is not found, return a 404 error
        if (!card) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: MESSAGES.CARD_NOT_FOUND });
        }

        await card.update(req.body);

        res.status(HTTP_STATUS_CODES.OK).json(card);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Deletes an existing card by Id from the database.
     *
     * @param {Object} req - The request object containing the cardId in the URL parameters.
     * @param {Object} res - The response object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {void} - Returns a 204 No Content response on successful deletion,
     *                   or an appropriate error response if the card is not found
     *                   or if an error occurs.
     */
    deleteCardByID: async (req, res, next) => {
      const { id } = req.params;

      // Check if ID is supplied
      if (!id) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.CARD_ID_IS_REQUIRED });
      }

      try {
        // Find the card by the id param in the database
        const card = await cardsModel.findByPk(req.params.id);

        // If the card is not found, return a 404 error
        if (!card) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: MESSAGES.CARD_NOT_FOUND });
        }

        await card.destroy();

        res
          .status(HTTP_STATUS_CODES.NO_CONTENT)
          .json(MESSAGES.DELETE_CARD_SUCCESS);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Fetches cards from the database by pagination and sends the card data as a response.
     *
     * @param {Object} req - The request object containing the limit and page query parameters.
     * @param {Object} res - The response object used to send the response back to the client.
     * @param {Function} next - The next middleware function in the stack, used for error handling.
     *
     * @returns {Object} - The card data with pagination metadata included in the response object on success or an appropriate error response.
     */
    getCards: async (req, res, next) => {
      const {
        limit = 10,
        page = 1,
        name,
        type,
        number,
        level,
        attribute,
        attackGe,
        attackLe,
        defenseGe,
        defenseLe,
      } = req.query;

      const offset = limit * (page - 1);
      const levelFilter = level ? parseInt(level) : null;
      const attackGreaterThan = attackGe ? parseInt(attackGe) : null;
      const attackLessThan = attackLe ? parseInt(attackLe) : null;
      const defenseGreaterThan = defenseGe ? parseInt(defenseGe) : null;
      const defenseLessThan = defenseLe ? parseInt(defenseLe) : null;

      // Validate the limit query parameter
      const isLimitInValid = limit < 1 || limit > 100;

      if (isLimitInValid) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          error: {
            code: MESSAGES.INVALID_PARAMETER,
            message: MESSAGES.INVALID_LIMIT,
          },
        });
      }

      // Build the filter conditions
      const queryConditions = {
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(type && { type: { [Op.like]: `%${type}%` } }),
        ...(number && { number: { [Op.like]: `%${number}%` } }),
        ...(attribute && { attribute: { [Op.like]: `%${attribute}%` } }),
        ...(levelFilter && { level: levelFilter }),
      };

      // Add attack greater than options if provided by the user
      if (attackGreaterThan) {
        queryConditions.attack = { [Op.gte]: attackGreaterThan };
      }

      // Add attack less than options if provided by the user
      if (attackLessThan) {
        queryConditions.attack = {
          ...queryConditions.attack,
          [Op.lte]: attackLessThan,
        };
      }

      // Add defense greater than options if provided by the user
      if (defenseGreaterThan) {
        queryConditions.defense = { [Op.gte]: defenseGreaterThan };
      }

      // Add defense less than options if provided by the user
      if (defenseLessThan) {
        queryConditions.defense = {
          ...queryConditions.defense,
          [Op.lte]: defenseLessThan,
        };
      }

      try {
        const { count, rows } = await cardsModel.findAndCountAll({
          where: queryConditions,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          order: [['id', 'ASC']], // Order by id in ascending order
        });

        const totalPages = Math.ceil(count / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        return res.status(HTTP_STATUS_CODES.OK).json({
          cards: rows,
          pagination: {
            totalPages,
            totalItems: count,
            currentPage: parseInt(page, 10),
            nextPage,
            previousPage,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  };
};
