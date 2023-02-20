'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (QueryInterface, Sequelize) {
    await QueryInterface.changeColumn('admins', 'email', {
      type: DataTypes.CHAR(32)
    })
    await QueryInterface.changeColumn('admins', 'password', {
      type: DataTypes.CHAR(100)
    })
  },

  async down (QueryInterface, Sequelize) {
    await QueryInterface.changeColumn('admins', 'email', {
      type: DataTypes.CHAR(255)
    })
    await QueryInterface.changeColumn('admins', 'password', {
      type: DataTypes.CHAR(255)
    })
  }
};