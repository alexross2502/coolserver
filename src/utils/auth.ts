const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class Auth {
  async passwordCheck(userPassword: string, adminPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(userPassword, adminPassword, function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  async login(login: string, userPassword: string, adminPassword: string, role: string, id: string) {
    let token = "secret";
    if (await this.passwordCheck(userPassword, adminPassword)) {
      token = jwt.sign(
        {
          login,
          role,
          id
        },
        "dev-jwt",
        { expiresIn: 60 * 60 * 3 }
      );
      
    }
    return {
      availability: true,
      token: `Bearer ${token}`,
    };
  }
}

export let auth = new Auth();
