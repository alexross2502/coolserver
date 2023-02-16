'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (QueryInterface, Sequelize) {
    await QueryInterface.changeColumn('masters', 'surname', {
      type: DataTypes.CHAR(32)
    })
    await QueryInterface.changeColumn('masters', 'name', {
      type: DataTypes.CHAR(32)
    })
  },

  async down (QueryInterface, Sequelize) {
    await QueryInterface.changeColumn('masters', 'surname', {
      type: DataTypes.CHAR(255)
    })
    await QueryInterface.changeColumn('masters', 'name', {
      type: DataTypes.CHAR(255)
    })
  }
};