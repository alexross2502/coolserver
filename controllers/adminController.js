const { Admin } = require("../models/models");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const Validator = require("../middleware/validator");

class AdminController {
  async check(req, res, next) {
    try {
      const { login, password } = req.body;
      let token = "secret";
      let availability = await Admin.findOne({
        where: { email: login, password: password },
      });
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
}

async function create(email, password) {
  let availability = await Admin.findOne({
    where: { email: "admin@example.com" },
  });
  if (!availability && Validator.checkEmail(email)) {
    await Admin.create({ email, password });
  }
}

create("admin@example.com", "passwordsecret");

module.exports = new AdminController();
