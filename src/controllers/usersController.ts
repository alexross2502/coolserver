import { Admin, Clients, Masters } from "../models/models";
import tokenDecoder from "../utils/tokenDecoder";

export async function currentUser(req, res) {
  let userData = null;
  try {
    const user = tokenDecoder(req.headers.authorization);
    switch (user.role) {
      case "admin":
        userData = await Admin.findOne({
          where: { id: user.id },
          attributes: ["email"],
        });
        break;
      case "client":
        userData = await Clients.findOne({
          where: { id: user.id },
          attributes: ["email", "name"],
        });
        break;
      case "master":
        userData = await Masters.findOne({
          where: { id: user.id },
          attributes: ["email", "name", "surname", "rating"],
        });
      default:
        userData;
    }
    return res.status(200).json(userData).end();
  } catch (e) {
    return res.status(400).json(userData).end();
  }
}
