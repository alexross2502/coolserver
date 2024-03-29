import * as jwt from "jsonwebtoken";
import { DataTypes } from "sequelize";

export default function (data) {
  try {
    const token = data.split(" ")[1];
    const decodedToken = jwt.verify(token, "dev-jwt");
    const payloadFromToken = decodedToken as {
      login: string;
      role: string;
      id: typeof DataTypes.UUID;
      iat: number;
      exp: number;
    };
    return payloadFromToken;
  } catch (e) {
    throw new Error("error");
  }
}
