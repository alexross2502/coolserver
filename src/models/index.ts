"use strict";

import { Sequelize } from "sequelize";
import sequelize from "../db";

const config = {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: process.env.DB_PORT,
};
const db = {};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
