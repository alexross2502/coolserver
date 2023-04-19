const jwt = require("jsonwebtoken");

export default function (token) {
  try {
    const decodedToken = jwt.verify(token, "dev-jwt");
    const payloadFromToken = decodedToken as {
      id: string;
      type: string;
    };
    if (payloadFromToken.type !== "confirmation") {
      return false;
    }
    return payloadFromToken.id;
  } catch (e) {
    return false;
  }
}
