const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  "heroku_database",
  "heroku_database",
  "MAKROMINxxx111",
  {
    dialect: "mysql",
    host: "db4free.net",
    port: "3306",
  },
  {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);
