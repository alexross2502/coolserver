const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Reservation = sequelize.define("reservation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: { type: DataTypes.STRING, allowNull: false },
  hours: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { Reservation };
