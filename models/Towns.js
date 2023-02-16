const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Towns = sequelize.define("towns", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

module.exports = { Towns };
