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
      day: { type: DataTypes.DATE(6), allowNull: false },
      end: { type: DataTypes.DATE(6), allowNull: false },
      size: { type: DataTypes.CHAR(30), allowNull: false },
      startTime: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE(6) },
      updatedAt: { type: DataTypes.DATE(6) },
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.dropTable("reservations");
  },
};
