"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.createTable("towns", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      masterId: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.CHAR(30) },
      updatedAt: { type: DataTypes.CHAR(30) },
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.dropTable("towns");
  },
};
