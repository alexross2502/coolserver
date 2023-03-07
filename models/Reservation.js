const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Reservation = sequelize.define("reservations", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: {
    type: DataTypes.DATE(6),
  },
  size: {
    type: DataTypes.CHAR(30),
    allowNull: false,
  },
  hours: { type: DataTypes.CHAR(30), allowNull: false },
  master_id: { type: DataTypes.CHAR(36), allowNull: true },
  towns_id: { type: DataTypes.CHAR(36), allowNull: true },
  clientId: { type: DataTypes.CHAR(36), allowNull: true },
});

module.exports = { Reservation };
