'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn('reservations', 'clientId', {
      type: DataTypes.CHAR(36).BINARY,
      references: {
        model: {
          tableName: 'clients'
        },
        key: 'id',
        
      }
    })
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn('reservations', 'clientId')
  }
}
