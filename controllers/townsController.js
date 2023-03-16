const { Towns } = require("../models/models");
const ApiError = require("../error/ApiError");
const { validationResult } = require("express-validator");

class TownsController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { name } = req.body;

      let createdAt = Date.now();
      let updatedAt = Date.now();
      const town = await Towns.create({
        name: name,
      });
      return res.status(200).json(town).end();
    } catch (e) {
      return res.status(400).json({ message: "error" }).end();
    }
  }

  async getAll(req, res) {
    const towns = await Towns.findAll();
    return res.json(towns);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const towns = await Towns.destroy({ where: { id: id } });
    if (towns) {
      return res.status(200).json(towns).end();
    } else {
      return res.status(400).json({ message: "wrong data" }).end();
    }
  }
}

module.exports = new TownsController();
