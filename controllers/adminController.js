const { Admin } = require("../models/models");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const Validator = require("../middleware/validator");
const bcrypt = require("bcrypt");

class AdminController {
  async check(req, res, next) {
    try {
      const { login, password } = req.body;
      let token = "secret";
      let availability = await Admin.findOne({
        where: { email: login, password: password },
      });
      availability = true;
      if (!!availability) {
        token = jwt.sign(
          {
            login: login,
          },
          "dev-jwt",
          { expiresIn: 60 * 60 * 3 }
        );
      }
      return res.json({
        availability: !!availability,
        token: `Bearer ${token}`,
      });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    let { email, password } = req.body;
    let availability = await Admin.findOne({
      where: { email: email },
    });
    try {
      if (!availability && Validator.checkEmail(email)) {
        const salt = await bcrypt.genSalt(3);
        password = await bcrypt.hash(password, salt);
        let admin = await Admin.create({ email, password });
        return res.json(admin);
      } else {
        return res.json("Такой логин уже используется");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new AdminController();
