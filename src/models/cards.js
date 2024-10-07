// Libs
import { DataTypes } from 'sequelize';

// DB
import db from '../libs/db.js';

// Constants
import {
  VALID_CARD_TYPES,
  VALID_CARD_SUB_TYPES,
  VALID_CARD_ATTRIBUTES,
} from '../constants/cards.js';

const Cards = db.sequelize.define('Cards', {
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
  subTypes: {
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
});

Cards.associate = (models) => {
  Cards.belongsTo(models.User);
};

export default Cards;
