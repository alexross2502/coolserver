"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn("towns", "masterId");
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn("towns", "masterId", {
      type: DataTypes.STRING,
    });
  },
};
