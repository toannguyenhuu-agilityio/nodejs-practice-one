'use strict';
/** @type {import('sequelize-cli').Migration} */

const {
  VALID_CARD_TYPES,
  VALID_CARD_ATTRIBUTES,
  VALID_CARD_SUB_TYPES,
} = require('../src/constants/cards.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [VALID_CARD_TYPES],
        },
      },
      image: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      attribute: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [VALID_CARD_ATTRIBUTES],
        },
      },
      subtypes: {
        type: Sequelize.TEXT,
        validate: {
          isIn: [VALID_CARD_SUB_TYPES],
        },
      },
      level: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 6,
        },
      },
      attack: {
        type: Sequelize.INTEGER,
      },
      defense: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cards');
  },
};
