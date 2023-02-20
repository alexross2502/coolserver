'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn('towns', 'masterId')
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn('towns', 'masterId', {
      type: DataTypes.STRING
    })
  }
}

