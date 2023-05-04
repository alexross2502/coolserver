"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.createTable("images", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      url: { type: DataTypes.STRING, unique: true, allowNull: false },
      reservation_id: { type: DataTypes.UUID, allowNull: false },
      public_id: { type: DataTypes.STRING, allowNull: false },
    });
    await QueryInterface.addColumn("reservations", "images", {
      type: DataTypes.VIRTUAL,
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.dropTable("images");
    await QueryInterface.removeColumn("reservations", "images");
  },
};
