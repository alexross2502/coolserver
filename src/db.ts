import dbCredentials from "./config/config";
const { Sequelize } = require("sequelize");

let sequelize = new Sequelize(
  dbCredentials.development.database,
  dbCredentials.development.username,
  dbCredentials.development.password,
  dbCredentials.options,
  dbCredentials.ssl
);
export default sequelize;
