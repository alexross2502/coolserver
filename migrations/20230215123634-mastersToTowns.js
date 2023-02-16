'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn('masters', 'townId', {
      type: DataTypes.CHAR(36).BINARY,
      references: {
        model: {
          tableName: 'towns'
        },
        key: 'id',
        
      }
    })
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn('masters', 'townId')
  }
}
