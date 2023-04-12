import * as jwt from "jsonwebtoken";

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error("error");
      }
      const decodedToken = jwt.verify(token, "dev-jwt");
      const payloadFromToken = decodedToken as {
        login: string;
        role: string;
        id: string;
        iat: number;
        exp: number;
      };
      let hasRole = roles.includes(payloadFromToken.role);
      if (!hasRole) {
        throw new Error("error");
      }
      req.user = payloadFromToken;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
  };
};
