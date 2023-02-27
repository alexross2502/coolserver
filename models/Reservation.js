const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Reservation = sequelize.define("reservations", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: { type: DataTypes.INTEGER, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  hours: { type: DataTypes.INTEGER, allowNull: false },
  master_id: { type: DataTypes.CHAR(36), allowNull: true },
  towns_id: { type: DataTypes.CHAR(36), allowNull: true },
  clientId: { type: DataTypes.CHAR(36), allowNull: true },
});

module.exports = { Reservation };
