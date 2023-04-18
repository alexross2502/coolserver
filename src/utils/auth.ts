import { authTokenTime } from "./constants";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class Auth {
  async passwordCheck(
    passwordFromRequest: string,
    passwordFromDataBase: string
  ) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        passwordFromRequest,
        passwordFromDataBase,
        function (err, res) {
          if (err) return reject(err);
          return resolve(res);
        }
      );
    });
  }

  async login(
    login: string,
    passwordFromRequest: string,
    passwordFromDataBase: string,
    role: string,
    id: string
  ) {
    let token = "secret";
    if (await this.passwordCheck(passwordFromRequest, passwordFromDataBase)) {
      token = jwt.sign(
        {
          login,
          role,
          id,
        },
        "dev-jwt",
        { expiresIn: authTokenTime }
      );
    }
    return {
      availability: true,
      token: `Bearer ${token}`,
    };
  }
}

export let auth = new Auth();
