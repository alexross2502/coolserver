"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QueryInterface, Sequelize) {
    await QueryInterface.addColumn("masters", "email", {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: "users",
        },
        key: "login",
      },
    });
    await QueryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      login: { type: DataTypes.CHAR(32), unique: true, allowNull: false },
      password: { type: DataTypes.CHAR(100), allowNull: false },
      role: { type: DataTypes.CHAR(16), allowNull: false },
      createdAt: { type: DataTypes.DATE(6) },
      updatedAt: { type: DataTypes.DATE(6) },
    });
    await QueryInterface.addConstraint("admins", {
      fields: ["email"],
      type: "foreign key",
      name: "admins_adminEmail_foreign_idx",
      references: {
        table: "users",
        field: "login",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
    await QueryInterface.addConstraint("clients", {
      fields: ["email"],
      type: "foreign key",
      name: "clients_clientEmail_foreign_idx",
      references: {
        table: "users",
        field: "login",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
    await QueryInterface.addConstraint("masters", {
      fields: ["email"],
      type: "foreign key",
      name: "masters_mastersEmail_foreign_idx",
      references: {
        table: "users",
        field: "login",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  },

  async down(QueryInterface, Sequelize) {
    await QueryInterface.removeColumn("masters", "email");
    await QueryInterface.dropTable("users");
    await QueryInterface.removeConstraint(
      "admins",
      "admins_adminEmail_foreign_idx"
    );
    await QueryInterface.removeConstraint(
      "clients",
      "clients_clientEmail_foreign_idx"
    );
    await QueryInterface.removeConstraint(
      "masters",
      "masters_mastersEmail_foreign_idx"
    );
  },
};
