"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.addColumn("masters", "password", {
      type: DataTypes.CHAR(100),
      allowNull: false
    });
    
    await QueryInterface.addColumn("clients", "password", {
      type: DataTypes.CHAR(100),
      allowNull: true,
    });
  },

  async down(QueryInterface, Sequelize) {
   await QueryInterface.removeColumn("masters", "password")

   await QueryInterface.removeColumn("clients", "password")
  },
};
