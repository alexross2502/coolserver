"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.changeColumn("admins", "email", {
      type: DataTypes.CHAR(32),
    });
    await QueryInterface.changeColumn("admins", "password", {
      type: DataTypes.CHAR(100),
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.changeColumn("admins", "email", {
      type: DataTypes.CHAR(255),
    });
    await QueryInterface.changeColumn("admins", "password", {
      type: DataTypes.CHAR(255),
    });
  },
};
