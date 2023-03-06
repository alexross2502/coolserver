const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const moment = require("moment");

const Reservation = sequelize.define("reservations", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: {
    type: DataTypes.DATE(6),
    set(value) {
      const kyivFormat = moment(+value).tz("Europe/Tallinn");
      console.log(kyivFormat.format());
      /*let d = new Date(+value);
      console.log(value);
      this.setDataValue("day", d.toString("en-US", { hours12: false }));
      console.log(d.toString("en-US", { hours12: false }));*/
      this.setDataValue("day", kyivFormat.format());
    },
    get() {
      return new Date(this.getDataValue("day")).getTime();
    },
    allowNull: false,
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
