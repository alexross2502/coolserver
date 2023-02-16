const { Clients } = require("../models/models");
const ApiError = require("../error/ApiError");
const Validator = require("../middleware/validator");

class ClientsController {
  async create(req, res, next) {
    try {
      const { name, email } = req.body;
      if (Validator.checkName(name) && Validator.checkEmail(email)) {
        const client = await Clients.create({ name, email });
        return res.json(client);
      } else {
        return res.json("Неверные данные");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const clients = await Clients.findAll();
    return res.json(clients);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const client = await Clients.destroy({ where: { id: id } });
    return res.json(client);
  }
}

module.exports = new ClientsController();
