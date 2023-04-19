"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn("reservations", "status", {
      type: DataTypes.ENUM("canceled", "confirmed", "executed"),
      allowNull: false,
    });
    await QueryInterface.addColumn("reservations", "price", {
      type: DataTypes.INTEGER,
      defaultValue: "confirmed",
      allowNull: false,
    });
    await QueryInterface.addColumn("towns", "tariff", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn("reservations", "status");
    await QueryInterface.removeColumn("reservations", "price");
    await QueryInterface.removeColumn("towns", "tariff");
  },
};
