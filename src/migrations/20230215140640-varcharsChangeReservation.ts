"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.changeColumn("reservations", "day", {
      type: DataTypes.BIGINT,
    });
  },

  async down(QueryInterface, Sequelize) {
    /** 
       unalterable 
    **/
    return null;
  },
};
