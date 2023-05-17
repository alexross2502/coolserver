import { Admin, Clients, Masters } from "../models/models";

export async function currentUser(req, res) {
  try {
    const role = req.user.role;
    let userData;
    switch (role) {
      case "admin":
        userData = await Admin.findOne({
          where: { id: req.user.id },
          attributes: ["email"],
        });
        break;
      case "client":
        userData = await Clients.findOne({
          where: { id: req.user.id },
          attributes: ["email", "name"],
        });
        break;
      case "master":
        userData = await Masters.findOne({
          where: { id: req.user.id },
          attributes: ["email", "name", "surname", "rating"],
        });
      default:
        throw new Error("not a user");
    }

    return res.status(200).json(userData).end();
  } catch (e) {
    return res.status(400).json().end();
  }
}
