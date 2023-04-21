import { Users, Clients } from "../models/models";
import { passwordHash } from "../utils/passwordHash";

export async function createNewClient(name, email, password, mailConfirmation) {
  try {
    const hashedPassword = await passwordHash(password);
    const createdAt = Date.now();
    const updatedAt = Date.now();
    let availability = await Users.create({
      login: email,
      password: hashedPassword,
      role: "client",
    });
    if (!availability) {
      throw new Error("Email is unavailable");
    }
    await Clients.create({
      id: availability.dataValues.id,
      name,
      email,
      createdAt,
      updatedAt,
      mailConfirmation,
    });
    return availability.dataValues;
  } catch (e) {
    return false;
  }
}
