"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await await QueryInterface.removeConstraint(
      "masters",
      "masters_townIds_foreign_idx"
    );

    //onUpdate: "cascade",
    //onDelete: "cascade",
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.changeColumn("towns", "name", {
      type: DataTypes.CHAR(255),
    });
  },
};
