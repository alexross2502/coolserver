import { Users, Clients } from "../models/models";
import { passwordHash } from "../utils/passwordHash";

export async function createNewClient(name, email, password) {
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
      name,
      email,
      createdAt,
      updatedAt,
    });
    return true;
  } catch (e) {
    return false;
  }
}
