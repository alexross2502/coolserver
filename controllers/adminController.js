const { Admin } = require("../models/models");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const Validator = require("../middleware/validator");
const bcrypt = require("bcrypt");

class AdminController {
  async check(req, res, next) {
    try {
      let { login, password } = req.body;
      let token = "secret";
      let availability = await Admin.findOne({
        where: { email: login },
      });
      if (!!availability) {
        bcrypt.compare(
          password,
          availability.dataValues.password,
          (err, result) => {
            if (result) {
              token = jwt.sign(
                {
                  login: login,
                },
                "dev-jwt",
                { expiresIn: 60 * 60 * 3 }
              );
              return res.json({
                availability: true,
                token: `Bearer ${token}`,
              });
            } else {
              return res.json("Неверный пароль");
            }
          }
        );
      } else {
        return res.json("Пользователь с таким логином не найден");
      }
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
        let createdAt = Date.now();
        let updatedAt = Date.now();
        let admin = await Admin.create({
          email,
          password,
          createdAt,
          updatedAt,
        });
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
