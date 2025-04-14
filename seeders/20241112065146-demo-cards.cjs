'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Cards',
      [
        {
          id: 1,
          number: `123456789${1}`,
          name: 'Card Name',
          type: 'Monster',
          image: 'https://example.com/image.jpg',
          attribute: 'Dark',
          subTypes: 'Ritual',
          level: 1,
          attack: 100,
          defense: 100,
          description: 'Card Description',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cards', null, {});
  },
};
