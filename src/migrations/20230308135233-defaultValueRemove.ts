"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.changeColumn("clients", "id", {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
    });
    await QueryInterface.changeColumn("masters", "id", {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
    });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.changeColumn("clients", "id", {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    });
    await QueryInterface.changeColumn("masters", "id", {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    });
  },
};
