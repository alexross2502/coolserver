"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.removeColumn("reservations", "hours");
    await QueryInterface.addColumn("reservations", "end", {
      type: DataTypes.DATE(6),
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.removeColumn("reservations", "end");
    await QueryInterface.addColumn("reservations", "hours", {
      type: DataTypes.CHAR(30),
    });
  },
};
