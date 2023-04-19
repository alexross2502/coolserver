const jwt = require("jsonwebtoken");

export default function (token) {
  try {
    const decodedToken = jwt.verify(token, "dev-jwt");
    console.log(decodedToken, "decoded");
    const payloadFromToken = decodedToken as {
      id: string;
      type: string;
    };
    if (payloadFromToken.type !== "confirmation") {
      return new Error("error");
    }
    return payloadFromToken.id;
  } catch (e) {
    return new Error(e.message);
  }
}
