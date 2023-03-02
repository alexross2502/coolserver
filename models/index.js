"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const config = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
};
const db = {};

let sequelize = new Sequelize(
  process.env.DB_USER,
  process.env.DB_DATABASE,
  process.env.DB_PASSWORD,
  config
);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
