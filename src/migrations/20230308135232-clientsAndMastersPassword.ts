"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.addColumn("masters", "email", {
      type: DataTypes.CHAR(36),
      allowNull: false
    }); 
    await QueryInterface.createTable("access", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      email: { type: DataTypes.CHAR(32), unique: true, allowNull: false },
      password: {type: DataTypes.CHAR(100), allowNull: false},
      role: {type: DataTypes.CHAR(16), allowNull: false},
      createdAt: { type: DataTypes.DATE(6) },
      updatedAt: { type: DataTypes.DATE(6) },
    });
  },

  async down(QueryInterface, Sequelize) {
   await QueryInterface.removeColumn("masters", "email")
   await QueryInterface.dropTable("access")
  },
};
