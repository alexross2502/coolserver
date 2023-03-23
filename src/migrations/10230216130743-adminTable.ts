"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.createTable("admins", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE(6) },
      updatedAt: { type: DataTypes.DATE(6) },
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.dropTable("admins");
  },
};
