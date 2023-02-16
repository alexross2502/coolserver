'use strict';

const { DataTypes, QueryInterface, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (QueryInterface, Sequelize) {
    await QueryInterface.changeColumn('reservations', 'day', {
      type: DataTypes.FLOAT
    })
  },

  async down (QueryInterface, Sequelize) {
    /** 
       unalterable 
    **/
   return null
  }
};