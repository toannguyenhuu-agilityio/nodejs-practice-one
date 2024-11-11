'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
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
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: ['Monster', 'Trap', 'Spell'],
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
          isIn: ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'],
        },
      },
      subTypes: {
        type: Sequelize.TEXT,
        validate: {
          isIn: [
            'Normal',
            'Ritual',
            'Effect',
            'XYZ',
            'Toon',
            'Fusion',
            'Synchro',
          ],
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cards');
  },
};
