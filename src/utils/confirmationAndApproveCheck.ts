import { Clients } from "../models/Clients";
import { Masters } from "../models/Masters";

export default async function (role, id) {
  if (role === "admin") {
    return true;
  }
  if (role === "client") {
    const client = await Clients.findOne({ where: { id } });
    return client.mailConfirmation;
  }
  if (role === "master") {
    const master = await Masters.findOne({ where: { id } });
    return master.mailConfirmation && master.adminApprove;
  }

  return false;
}
