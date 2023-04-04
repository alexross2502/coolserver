import { Masters } from "../models/models";
import { passwordHash } from "./passwordHash";
import { sendMasterRegistrationCredentials } from "./sendMail";
import * as expressValidator from "express-validator";
import * as express from "express";

export async function createMaster(
  req: express.Request,
  res: express.Response,
  sendCredentials: boolean = false
) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, surname, rating, townId, password, email } = req.body;
    let hashedPassword = await passwordHash(password);
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const master = await Masters.create({
      name,
      surname,
      rating,
      townId,
      createdAt,
      updatedAt,
      password: hashedPassword,
      email,
    });
    if (sendCredentials) {
      sendMasterRegistrationCredentials(email, name, surname, password);
    }
    return res.status(200).json(master).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}
