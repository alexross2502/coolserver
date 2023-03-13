"use strict";

const { DataTypes, QueryInterface, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_master_id_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_clientId_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_towns_id_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "masters",
      "reservations_clientId_foreign_idx"
    );

    await QueryInterface.addConstraint("masters", {
      fields: ["townId"],
      type: "foreign key",
      name: "masters_townId_foreign_idx",
      references: {
        table: "towns",
        field: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["master_id"],
      type: "foreign key",
      name: "reservations_master_id_foreign_idx",
      references: {
        table: "masters",
        field: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["towns_id"],
      type: "foreign key",
      name: "reservations_towns_id_foreign_idx",
      references: {
        table: "towns",
        field: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["clientId"],
      type: "foreign key",
      name: "reservations_clientId_foreign_idx",
      references: {
        table: "clients",
        field: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_master_id_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_clientId_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "reservations",
      "reservations_towns_id_foreign_idx"
    );

    await QueryInterface.removeConstraint(
      "masters",
      "reservations_clientId_foreign_idx"
    );

    await QueryInterface.addConstraint("masters", {
      fields: ["townId"],
      type: "foreign key",
      name: "masters_townId_foreign_idx",
      references: {
        table: "towns",
        field: "id",
      },
      onUpdate: "restrict",
      onDelete: "restrict",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["master_id"],
      type: "foreign key",
      name: "reservations_master_id_foreign_idx",
      references: {
        table: "masters",
        field: "id",
      },
      onUpdate: "restrict",
      onDelete: "restrict",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["towns_id"],
      type: "foreign key",
      name: "reservations_towns_id_foreign_idx",
      references: {
        table: "towns",
        field: "id",
      },
      onUpdate: "restrict",
      onDelete: "restrict",
    });

    await QueryInterface.addConstraint("reservations", {
      fields: ["clientId"],
      type: "foreign key",
      name: "reservations_clientId_foreign_idx",
      references: {
        table: "clients",
        field: "id",
      },
      onUpdate: "restrict",
      onDelete: "restrict",
    });
  },
};
