const jwt = require("jsonwebtoken");

export default function (token) {
  try {
    const decodedToken = jwt.verify(token, "dev-jwt");
    const payloadFromToken = decodedToken as {
      id: string;
    };
    return payloadFromToken.id;
  } catch (e) {
    return undefined;
  }
}
