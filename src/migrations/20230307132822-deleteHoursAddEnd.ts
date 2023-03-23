"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

//// @type {import('sequelize-cli').Migration}
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.addColumn("reservations", "end", {
      type: DataTypes.DATE(6),
    });
    await QueryInterface.removeColumn("reservations", "hours");

    await QueryInterface.sequelize.query(
      `UPDATE reservations SET end =(CASE WHEN size='large' THEN date_add(day, INTERVAL 5 HOUR) WHEN size='medium' THEN date_add(day, INTERVAL 3 HOUR) WHEN size='small' THEN date_add(day, INTERVAL 1 HOUR) END)`
    );
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.addColumn("reservations", "hours", {
      type: DataTypes.CHAR(32),
    });
    await QueryInterface.sequelize.query(
      `UPDATE reservations SET hours = CONCAT(DATE_FORMAT(day, '%H'), '-', DATE_FORMAT(end, '%H'))`
    );
    await QueryInterface.removeColumn("reservations", "end");
  },
};
