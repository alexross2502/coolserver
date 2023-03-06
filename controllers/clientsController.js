const { Clients } = require("../models/models");
const ApiError = require("../error/ApiError");
const Validator = require("../middleware/validator");

class ClientsController {
  async create(req, res, next) {
    try {
      const { name, email } = req.body;
      if (Validator.checkName(name) && Validator.checkEmail(email)) {
        let createdAt = Date.now();
        let updatedAt = Date.now();
        const client = await Clients.create({
          name,
          email,
          createdAt,
          updatedAt,
        });

        return res.status(200).json(client).end();
      } else {
        return res.status(400).json({ message: "wrong data" }).end();
      }
    } catch (e) {
      return res.status(403).json({ message: "error" }).end();
    }
  }

  async getAll(req, res) {
    const clients = await Clients.findAll();
    return res.json(clients);
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const client = await Clients.destroy({ where: { id: id } });
      if (client) {
        return res.status(200).json(client).end();
      } else {
        return res.status(400).json({ message: "wrong data" }).end();
      }
    } catch (e) {
      return res.status(403).json({ message: "error" }).end();
    }
  }
}

module.exports = new ClientsController();
