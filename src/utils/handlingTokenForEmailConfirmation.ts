const jwt = require("jsonwebtoken");

export default function (token) {
  try {
    const decodedToken = jwt.verify(token, "dev-jwt");
    console.log(decodedToken, "decoded");
    const payloadFromToken = decodedToken as {
      id: string;
      type: string;
    };
    console.log(payloadFromToken, "payloadFromToken");
    if (payloadFromToken.type !== "confirmation") {
      return undefined;
    }
    return payloadFromToken.id;
  } catch (e) {
    return undefined;
  }
}
