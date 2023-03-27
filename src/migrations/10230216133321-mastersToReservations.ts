"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn("reservations", "master_id", {
      type: DataTypes.CHAR(36).BINARY,
      references: {
        model: {
          tableName: "masters",
        },
        key: "id",
      },
    });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn("reservations", "master_id");
  },
};
