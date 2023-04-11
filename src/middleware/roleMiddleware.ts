const jwt = require("jsonwebtoken");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" }).end();
      }
      const userRole = jwt.verify(token, "dev-jwt").role;
      let hasRole = roles.includes(userRole);
      if (!hasRole) {
        return res.status(401).json({ message: "Unauthorized" }).end();
      }
      next();
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
  };
};
