'use strict';

import { Model } from 'sequelize';
import {
  VALID_CARD_TYPES,
  VALID_CARD_ATTRIBUTES,
  VALID_CARD_SUB_TYPES,
} from '../src/constants/cards.js';

module.exports = (sequelize, DataTypes) => {
  class Cards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cards.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Cards.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      number: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [VALID_CARD_TYPES],
        },
      },
      image: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      attribute: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [VALID_CARD_ATTRIBUTES],
        },
      },
      subtypes: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [VALID_CARD_SUB_TYPES],
        },
      },
      level: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 6,
        },
      },
      attack: {
        type: DataTypes.INTEGER,
      },
      defense: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      material: {
        type: DataTypes.INTEGER,
      },
      feature: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Cards',
    },
  );
  return Cards;
};
