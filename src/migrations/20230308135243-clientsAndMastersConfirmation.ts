"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.addColumn("clients", "mailConfirmation", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await QueryInterface.addColumn("masters", "mailConfirmation", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await QueryInterface.addColumn("masters", "adminApprove", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.removeColumn("clients", "mailConfirmation");
    await QueryInterface.removeColumn("masters", "mailConfirmation");
    await QueryInterface.removeColumn("masters", "adminApprove");
  },
};
