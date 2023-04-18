const jwt = require("jsonwebtoken");

export default function (id) {
  const token = jwt.sign({ id }, "dev-jwt", { expiresIn: 60 * 60 * 24 });
  return token;
}
