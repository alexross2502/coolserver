"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.createTable("reservations", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      day: { type: DataTypes.INTEGER, allowNull: false },
      size: { type: DataTypes.CHAR(30), allowNull: false },
      hours: { type: DataTypes.CHAR(30), allowNull: false },
      startTime: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.CHAR(30) },
      updatedAt: { type: DataTypes.CHAR(30) },
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.dropTable("reservations");
  },
};
