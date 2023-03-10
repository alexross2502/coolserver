const { Masters, Towns } = require("../models/models");
const ApiError = require("../error/ApiError");
const Validator = require("../middleware/validator");
const { Sequelize } = require("../db");
const db = require("../models/index");

class MastersController {
  async create(req, res, next) {
    try {
      const { name, surname, rating, townId } = req.body;
      if (
        Validator.checkName(name) &&
        Validator.checkName(surname) &&
        Validator.checkRating(rating)
      ) {
        let createdAt = Date.now();
        let updatedAt = Date.now();
        const master = await Masters.create({
          name,
          surname,
          rating,
          townId,
          createdAt,
          updatedAt,
        });
        return res.status(200).json(master).end();
      } else {
        return res.status(400).json({ message: "wrong data" }).end();
      }
    } catch (e) {
      return res.status(403).json({ message: "error" }).end();
    }
  }

  async getAll(req, res) {
    const masters = await Masters.findAll({
      attributes: ["id", "name", "surname", "rating", "townId"],
    });

    return res.json(masters);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const master = await Masters.destroy({ where: { id: id } });
    if (master) {
      return res.status(200).json(master).end();
    } else {
      return res.status(400).json({ message: "wrong data" }).end();
    }
  }
  /*
  async getAvailable(req, res) {
    const { name } = req.params;
    const master = await Masters.findAll({ where: { townName: name } });
    return res.json(master);
  }*/
}

module.exports = new MastersController();
