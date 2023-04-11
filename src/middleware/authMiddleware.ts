//const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
    const decodedData = jwt.verify(token, "dev-jwt");
    req.user = decodedData;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" }).end();
  }
};
