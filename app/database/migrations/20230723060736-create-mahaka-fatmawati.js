'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mahaka_fatmawatis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      frameid: {
        type: Sequelize.STRING
      },
      area: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      dataid: {
        type: Sequelize.STRING
      },
      bearing: {
        type: Sequelize.STRING
      },
      countingdirection: {
        type: Sequelize.STRING
      },
      anglewithcountingline: {
        type: Sequelize.STRING
      },
      lastrecid: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      time: {
        type: Sequelize.TIME
      },
      timestamp: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mahaka_fatmawatis');
  }
};