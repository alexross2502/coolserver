import { confirmationTokenTime } from "./constants";

const jwt = require("jsonwebtoken");

export default function (id) {
  const token = jwt.sign({ id, type: "confirmation" }, "dev-jwt", {
    expiresIn: confirmationTokenTime,
  });
  return token;
}
