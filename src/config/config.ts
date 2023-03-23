require("dotenv").config();
import process = require("process");
import { Dialect } from "sequelize";

const dbCredentials = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
  },
  options: {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
  },
  ssl: {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

export default dbCredentials;
