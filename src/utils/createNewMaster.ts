import { Users, Masters } from "../models/models";
import { passwordHash } from "./passwordHash";

export async function createMaster(
  name,
  surname,
  rating,
  townId,
  email,
  password
) {
  try {
    let hashedPassword = await passwordHash(password);
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let availability = await Users.create({
      login: email,
      password: hashedPassword,
      role: "master",
    });
    if (!availability) {
      throw new Error("Email is unavailable");
    }
    await Masters.create({
      id: availability.dataValues.id,
      name,
      surname,
      rating,
      townId,
      createdAt,
      updatedAt,
      email,
    });
    return true;
  } catch (e) {
    return false;
  }
}
