"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn("masters", "townName", {
      type: DataTypes.STRING,
      references: {
        model: {
          tableName: "towns",
        },
        key: "name",
      },
    });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn("masters", "townName");
  },
};
