const { Masters } = require("../models/models");
const ApiError = require("../error/ApiError");
const Validator = require("../middleware/validator");

class MastersController {
  async create(req, res, next) {
    try {
      const { name, surname, rating, townName } = req.body;
      if (
        Validator.checkName(name) &&
        Validator.checkName(surname) &&
        Validator.checkName(townName) &&
        Validator.checkRating(rating) &&
        (await Validator.checkTownForMaster(townName))
      ) {
        const master = await Masters.create({
          name,
          surname,
          rating,
          townName,
        });
        return res.json(master);
      } else {
        return res.json("Неверные данные");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const masters = await Masters.findAll();
    return res.json(masters);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const master = await Masters.destroy({ where: { id: id } });
    return res.json(master);
  }

  async getAvailable(req, res) {
    const { name } = req.params;
    const master = await Masters.findAll({ where: { townName: name } });
    return res.json(master);
  }
}

module.exports = new MastersController();
