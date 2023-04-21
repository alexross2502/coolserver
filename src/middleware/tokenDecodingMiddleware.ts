import * as jwt from "jsonwebtoken";

export default function (req, res, next) {
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
    req.user = payloadFromToken;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" }).end();
  }
}
